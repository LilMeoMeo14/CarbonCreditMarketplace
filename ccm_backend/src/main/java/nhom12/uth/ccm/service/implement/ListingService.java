package nhom12.uth.ccm.service.implement;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ListingRequest;
import nhom12.uth.ccm.dto.response.ListingResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.ListingMapper;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.Listing;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.ListingStatus;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.repository.IListingRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IListingService;

@Service
@RequiredArgsConstructor
public class ListingService implements IListingService {

    private final IUserRepository userRepository;
    private final ICarbonWalletRepository carbonWalletRepository;
    private final IListingRepository listingRepository;
    private final ListingMapper listingMapper;

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

}