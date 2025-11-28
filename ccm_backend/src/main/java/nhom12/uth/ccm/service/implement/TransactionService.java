package nhom12.uth.ccm.service.implement;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.response.CreditTransactionResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CreditTransactionMapper;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.CreditTransaction;
import nhom12.uth.ccm.model.EWallet;
import nhom12.uth.ccm.model.Listing;
import nhom12.uth.ccm.model.PaymentTransaction;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.ListingStatus;
import nhom12.uth.ccm.model.enums.ListingType;
import nhom12.uth.ccm.model.enums.PaymentStatus;
import nhom12.uth.ccm.model.enums.PaymentType;
import nhom12.uth.ccm.model.enums.TransactionType;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.repository.IEWalletRepository;
import nhom12.uth.ccm.repository.IListingRepository;
import nhom12.uth.ccm.repository.IPaymentTransactionRepository;
import nhom12.uth.ccm.repository.ITransactionRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ITransactionService;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final ITransactionRepository transactionRepository;
    private final IPaymentTransactionRepository paymentTransactionRepository;
    private final IListingRepository listingRepository;
    private final IUserRepository userRepository;
    private final IEWalletRepository eWalletRepository;
    private final ICarbonWalletRepository carbonWalletRepository;

    private final CreditTransactionMapper creditTransactionMapper;

    @Override
    @Transactional
    public CreditTransactionResponse buyNow(Long listingId, BigDecimal amountToBuy, String buyerId) {
        // lay thong tin listing
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException(ErrorCode.LISTING_NOT_FOUND));

        // lay thong tin user
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Validate Listing
        if (listing.getStatus() != ListingStatus.ACTIVE)
            throw new RuntimeException("Listing is not active");
        if (listing.getListingType() != ListingType.DIRECT_SALE)
            throw new RuntimeException("This listing is for Auction only");
        if (listing.getSeller().getUserId().equals(buyerId))
            throw new RuntimeException("Cannot buy your own credits");
        if (listing.getAmount().compareTo(amountToBuy) < 0)
            throw new RuntimeException("Not enough credits to buy");

        // Tính toán tiền
        BigDecimal totalMoney = listing.getPrice().multiply(amountToBuy);

        // Lấy Ví Tiền (E-Wallet)
        EWallet buyerWallet = eWalletRepository.findByUser_UserId(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer wallet not found"));
        EWallet sellerWallet = eWalletRepository.findByUser_UserId(listing.getSeller().getUserId())
                .orElseThrow(() -> new RuntimeException("Seller wallet not found"));

        /* Giao dịch tiền */

        // Trừ tiền người mua
        buyerWallet.withdraw(totalMoney); // Hàm này sẽ tự throw nếu không đủ tiền
        eWalletRepository.save(buyerWallet);

        // Cộng tiền người bán
        sellerWallet.deposit(totalMoney);
        eWalletRepository.save(sellerWallet);

        // Lưu lịch sử dòng tiền (PaymentTransaction) cho cả 2
        savePaymentHistory(buyerWallet, totalMoney, PaymentType.PURCHASE, "Buy credits from listing #" + listingId);
        savePaymentHistory(sellerWallet, totalMoney, PaymentType.SALE_REVENUE, "Revenue from listing #" + listingId);

        // --- BẮT ĐẦU GIAO DỊCH TÍN CHỈ ---

        // Lấy Ví Tín Chỉ (CarbonWallet)
        CarbonWallet sellerCarbonWallet = carbonWalletRepository.findByUser_UserId(listing.getSeller().getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));
        CarbonWallet buyerCarbonWallet = carbonWalletRepository.findByUser_UserId(buyerId)
                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));

        // Trừ tín chỉ người bán (Trừ trong Locked Amount vì khi Listing, tín chỉ đã bị
        // khóa)
        sellerCarbonWallet.deductLockedCredits(amountToBuy);
        carbonWalletRepository.save(sellerCarbonWallet);

        // Cộng tín chỉ người mua (Vào Balance khả dụng)
        buyerCarbonWallet.deposit(amountToBuy);
        carbonWalletRepository.save(buyerCarbonWallet);

        // --- CẬP NHẬT LISTING ---
        listing.setAmount(listing.getAmount().subtract(amountToBuy));
        if (listing.getAmount().compareTo(BigDecimal.ZERO) == 0) {
            listing.setStatus(ListingStatus.SOLD);
        }
        listingRepository.save(listing);

        // --- LƯU LỊCH SỬ GIAO DỊCH CHÍNH (TRANSACTION) ---
        CreditTransaction transaction = CreditTransaction.builder()
                .listing(listing)
                .seller(listing.getSeller())
                .buyer(buyer)
                .amount(amountToBuy)
                .pricePerCredit(listing.getPrice())
                .totalMoney(totalMoney)
                .type(TransactionType.BUY_NOW)
                .build();

        CreditTransaction savedTransaction = transactionRepository.save(transaction);
        return creditTransactionMapper.toResponse(savedTransaction);
    }

    @Override
    public List<CreditTransactionResponse> getMyPurchaseHistory(String userId) {
        return transactionRepository.findByBuyer_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(creditTransactionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CreditTransactionResponse> getMySalesHistory(String userId) {
        return transactionRepository.findBySeller_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(creditTransactionMapper::toResponse)
                .collect(Collectors.toList());
    }

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