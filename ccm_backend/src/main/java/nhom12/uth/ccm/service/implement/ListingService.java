package nhom12.uth.ccm.service.implement;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ListingRequest;
import nhom12.uth.ccm.dto.response.BidResponse;
import nhom12.uth.ccm.dto.response.ListingResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.BidMapper;
import nhom12.uth.ccm.mapper.ListingMapper;
import nhom12.uth.ccm.model.Bid;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.CreditTransaction;
import nhom12.uth.ccm.model.EWallet;
import nhom12.uth.ccm.model.Listing;
import nhom12.uth.ccm.model.PaymentTransaction;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.BidStatus;
import nhom12.uth.ccm.model.enums.ListingStatus;
import nhom12.uth.ccm.model.enums.ListingType;
import nhom12.uth.ccm.model.enums.PaymentStatus;
import nhom12.uth.ccm.model.enums.PaymentType;
import nhom12.uth.ccm.model.enums.TransactionType;
import nhom12.uth.ccm.repository.IBidRepository;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.repository.IEWalletRepository;
import nhom12.uth.ccm.repository.IListingRepository;
import nhom12.uth.ccm.repository.IPaymentTransactionRepository;
import nhom12.uth.ccm.repository.ITransactionRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IListingService;

@Service
@RequiredArgsConstructor
public class ListingService implements IListingService {

    private final IUserRepository userRepository;
    private final ICarbonWalletRepository carbonWalletRepository;
    private final IListingRepository listingRepository;
    private final IBidRepository bidRepository;
    private final ITransactionRepository transactionRepository;
    private final IEWalletRepository eWalletRepository;
    private final IPaymentTransactionRepository paymentTransactionRepository;
    private final ListingMapper listingMapper;
    private final BidMapper bidMapper;

    @Override
    @Transactional
    public ListingResponse createListing(ListingRequest listingRequest, String userId) {
        /*
         * Luồng hoạt động
         * 1. Lấy thông tin người bán
         * 2. Lấy ví người bán
         * 3. Kiểm tra tín chỉ trong ví , không đủ -> quăng lỗi
         * 4. Tạo listing mới
         * 5.Lưu vào db
         */

        User seller = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        CarbonWallet wallet = carbonWalletRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));

        try {
            wallet.lockCredits(listingRequest.getAmount());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        carbonWalletRepository.save(wallet);

        Listing newListing = listingMapper.toListing(listingRequest);
        newListing.setSeller(seller);
        newListing.setStatus(ListingStatus.ACTIVE); // dang ban

        return listingMapper.tResponse(listingRepository.save(newListing));
    }

    @Override
    public List<ListingResponse> getActiveListings() {
        return listingRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.ACTIVE)
                .stream()
                .map(listingMapper::tResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ListingResponse> getMyListings(String userId) {
        return listingRepository.findBySeller_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(listingMapper::tResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelListing(Long listingId, String userId) {
        /*
         * Luồng hoạt động
         * 1. Tìm bài đăng chính chủ
         * 2. Chỉ được huỷ nếu đang ở trạng thái active
         * 3. Cập nhật trạng thái thành cancel
         * 4. Hoàn tiền lại cho ví
         */

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException(ErrorCode.LISTING_NOT_FOUND));

        if (!listing.getSeller().getUserId().equals(userId)) {
            throw new AppException(ErrorCode.NOT_LISTING_OWNER);
        }

        if (listing.getStatus() != ListingStatus.ACTIVE) {
            throw new AppException(ErrorCode.LISTING_NOT_ACTIVE);
        }

        // cancel neu listing dang active
        listing.setStatus(ListingStatus.CANCELLED);
        listingRepository.save(listing);

        // hoan tien

        CarbonWallet wallet = carbonWalletRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));

        wallet.unlockCredits(listing.getAmount());
        carbonWalletRepository.save(wallet);
    }

    @Override
    @Transactional
    public BidResponse placeBid(Long listingId, BigDecimal amount, String bidderId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException(ErrorCode.LISTING_NOT_FOUND));

        // 1. Validate cơ bản
        if (listing.getStatus() != ListingStatus.ACTIVE)
            throw new AppException(ErrorCode.LISTING_NOT_ACTIVE);
        if (listing.getListingType() != ListingType.AUCTION)
            throw new AppException(ErrorCode.NOT_AUCTION);
        if (listing.getExpiresAt() != null && listing.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new AppException(ErrorCode.AUCTION_EXPIRED);
        if (listing.getSeller().getUserId().equals(bidderId))
            throw new AppException(ErrorCode.NOT_BID_OWNER_LISTING);

        // 2. Validate Giá
        BigDecimal currentHighest = listing.getCurrentHighestBid() != null ? listing.getCurrentHighestBid()
                : listing.getPrice();
        // Logic: Nếu chưa ai đặt, giá đặt phải >= giá khởi điểm. Nếu có rồi, phải > giá
        // hiện tại.
        if (listing.getCurrentHighestBid() == null) {
            if (amount.compareTo(listing.getPrice()) < 0)
                throw new AppException(ErrorCode.BID_BELOW_START_PRICE);
        } else {
            if (amount.compareTo(currentHighest) <= 0)
                throw new AppException(ErrorCode.BID_NOT_HIGHER_THAN_CURRENT);
        }

        // 3. XỬ LÝ TIỀN CỌC (E-WALLET) - ĐÃ BỔ SUNG

        // A. Khóa tiền người mới (Bidder)
        EWallet bidderWallet = eWalletRepository.findByUser_UserId(bidderId)
                .orElseThrow(() -> new AppException(ErrorCode.WALLET_NOT_FOUND)); // Cần có ErrorCode này

        try {
            bidderWallet.lockMoney(amount); // Khóa số tiền đặt cọc
        } catch (IllegalArgumentException e) {
            // Bắt lỗi không đủ tiền từ Model
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }
        eWalletRepository.save(bidderWallet);

        // B. Hoàn tiền cho người cũ (Nếu có)
        Optional<Bid> highestBidOpt = bidRepository.findTopByListingOrderByAmountDesc(listing);
        if (highestBidOpt.isPresent()) {
            Bid oldBid = highestBidOpt.get();
            // Đổi trạng thái bid cũ
            oldBid.setStatus(BidStatus.OUTBID);
            bidRepository.save(oldBid);

            // Mở khóa tiền cho người cũ
            EWallet oldBidderWallet = eWalletRepository.findByUser_UserId(oldBid.getBidder().getUserId())
                    .orElseThrow(() -> new RuntimeException("Old bidder wallet not found"));
            oldBidderWallet.unlockMoney(oldBid.getAmount());
            eWalletRepository.save(oldBidderWallet);
        }

        // 4. Lưu lượt đặt giá (Bid)
        User bidder = userRepository.findById(bidderId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Bid newBid = Bid.builder()
                .listing(listing)
                .bidder(bidder)
                .amount(amount)
                .status(BidStatus.ACTIVE)
                .build();

        Bid savedBid = bidRepository.save(newBid);

        // 5. Cập nhật Listing
        listing.setCurrentHighestBid(amount);
        listing.setWinner(bidder); // Người thắng tạm thời
        listingRepository.save(listing);

        return bidMapper.toResponse(savedBid);
    }

    @Override
    @Transactional
    public void processExpiredAuctions() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Tìm các phiên đấu giá đang ACTIVE nhưng đã HẾT HẠN
        List<Listing> expiredListings = listingRepository.findAllByStatusAndListingTypeAndExpiresAtBefore(
                ListingStatus.ACTIVE,
                ListingType.AUCTION,
                now);

        // 2. Xử lý từng phiên một
        for (Listing listing : expiredListings) {
            closeAuction(listing);
        }
    }

    private void closeAuction(Listing listing) {
        // Tìm người trả giá cao nhất
        Optional<Bid> winningBidOpt = bidRepository.findTopByListingOrderByAmountDesc(listing);

        if (winningBidOpt.isPresent()) {
            // === TRƯỜNG HỢP 1: CÓ NGƯỜI MUA ===
            Bid winningBid = winningBidOpt.get();
            User winner = winningBid.getBidder();
            User seller = listing.getSeller();
            BigDecimal winningPrice = winningBid.getAmount(); // Tiền thật
            BigDecimal creditAmount = listing.getAmount(); // Tín chỉ

            // A. XỬ LÝ TIỀN (E-WALLET)
            // 1. Trừ tiền Winner: Tiền đang bị KHÓA -> Trừ luôn (Mất khỏi ví)
            EWallet winnerWallet = eWalletRepository.findByUser_UserId(winner.getUserId())
                    .orElseThrow(() -> new RuntimeException("Winner wallet not found"));
            winnerWallet.deductLockedMoney(winningPrice);
            eWalletRepository.save(winnerWallet);

            // 2. Cộng tiền Seller: Tiền về ví khả dụng
            EWallet sellerWallet = eWalletRepository.findByUser_UserId(seller.getUserId())
                    .orElseThrow(() -> new RuntimeException("Seller wallet not found"));
            sellerWallet.deposit(winningPrice);
            eWalletRepository.save(sellerWallet);

            // 3. Lưu lịch sử dòng tiền
            savePaymentHistory(winnerWallet, winningPrice, PaymentType.BID_PAYMENT,
                    "Auction payment for listing #" + listing.getListingId());
            savePaymentHistory(sellerWallet, winningPrice, PaymentType.SALE_REVENUE,
                    "Auction revenue listing #" + listing.getListingId());

            // B. XỬ LÝ TÍN CHỈ (CARBON WALLET)
            // 4. Trừ tín chỉ Seller: Tín chỉ đang bị KHÓA -> Trừ luôn
            CarbonWallet sellerCWallet = carbonWalletRepository.findByUser_UserId(seller.getUserId())
                    .orElseThrow(() -> new RuntimeException("Seller carbon wallet not found"));
            sellerCWallet.deductLockedCredits(creditAmount);
            carbonWalletRepository.save(sellerCWallet);

            // 5. Cộng tín chỉ Winner: Cộng vào balance
            CarbonWallet winnerCWallet = carbonWalletRepository.findByUser_UserId(winner.getUserId())
                    .orElseThrow(() -> new RuntimeException("Winner carbon wallet not found"));
            winnerCWallet.deposit(creditAmount);
            carbonWalletRepository.save(winnerCWallet);

            // C. CẬP NHẬT TRẠNG THÁI
            // 6. Cập nhật Bid -> WON
            winningBid.setStatus(BidStatus.WON);
            bidRepository.save(winningBid);

            // 7. Cập nhật Listing -> SOLD & Gán người thắng
            listing.setStatus(ListingStatus.SOLD);
            listing.setWinner(winner);
            listingRepository.save(listing);

            // D. LƯU LỊCH SỬ GIAO DỊCH
            CreditTransaction tx = CreditTransaction.builder()
                    .listing(listing)
                    .seller(seller)
                    .buyer(winner)
                    .amount(creditAmount)
                    .pricePerCredit(winningPrice.divide(creditAmount, 2, java.math.RoundingMode.HALF_UP)) // Tính đơn
                                                                                                          // giá trung
                                                                                                          // bình
                    .totalMoney(winningPrice)
                    .type(TransactionType.AUCTION_WIN)
                    .build();
            transactionRepository.save(tx);

            // System.out.println("Auction #" + listing.getListingId() + " SOLD to " +
            // winner.getEmail());

        } else {
            // === TRƯỜNG HỢP 2: KHÔNG AI MUA ===
            // Trả lại tín chỉ cho Seller (Mở khóa)
            CarbonWallet sellerCWallet = carbonWalletRepository.findByUser_UserId(listing.getSeller().getUserId())
                    .orElseThrow();
            sellerCWallet.unlockCredits(listing.getAmount());
            carbonWalletRepository.save(sellerCWallet);

            // Đổi trạng thái -> EXPIRED
            listing.setStatus(ListingStatus.EXPIRED);
            listingRepository.save(listing);

            System.out.println("Auction #" + listing.getListingId() + " EXPIRED (Nobids)");
        }
    }

    // luu lai lich su thanh toan
    private void savePaymentHistory(EWallet wallet, BigDecimal amount, PaymentType type, String desc) {
        PaymentTransaction pt = PaymentTransaction.builder()
                .eWallet(wallet)
                .amount(amount)
                .type(type)
                .status(PaymentStatus.COMPLETED)
                .description(desc)
                .build();
        paymentTransactionRepository.save(pt);
    }
}