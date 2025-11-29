package nhom12.uth.ccm.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.Listing;
import nhom12.uth.ccm.model.enums.ListingStatus;
import nhom12.uth.ccm.model.enums.ListingType;

@Repository
public interface IListingRepository extends JpaRepository<Listing, Long> {
    /**
     * 1. Dành cho NGƯỜI MUA (Marketplace):
     * Chỉ hiển thị các bài đăng đang ở trạng thái ACTIVE (Đang bán).
     * Sắp xếp theo ngày tạo mới nhất.
     */
    List<Listing> findByStatusOrderByCreatedAtDesc(ListingStatus status);

    /**
     * 2. Dành cho NGƯỜI BÁN (Quản lý bài đăng):
     * Tìm tất cả bài đăng của một người bán cụ thể (để họ xem/hủy).
     */
    List<Listing> findBySeller_UserIdOrderByCreatedAtDesc(String userId);

    /**
     * 3. (Nâng cao) Bộ lọc:
     * Tìm theo loại (Đấu giá hay Bán ngay) và Trạng thái.
     * Ví dụ: Chỉ xem các phiên Đấu giá đang diễn ra.
     */
    List<Listing> findByListingTypeAndStatus(ListingType type, ListingStatus status);

    /**
     * Tìm các phiên đấu giá đang ACTIVE nhưng đã hết hạn (expiresAt < now).
     */
    List<Listing> findAllByStatusAndListingTypeAndExpiresAtBefore(
            ListingStatus status,
            ListingType listingType,
            LocalDateTime now);

}
