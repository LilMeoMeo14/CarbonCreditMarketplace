package nhom12.uth.ccm.service;

import java.math.BigDecimal;
import java.util.List;

import nhom12.uth.ccm.dto.request.ListingRequest;
import nhom12.uth.ccm.dto.response.BidResponse;
import nhom12.uth.ccm.dto.response.ListingResponse;

public interface IListingService {
/**
    * Tạo bài đăng bán mới (Niêm yết).
    * Hành động này sẽ KHÓA (Lock) số lượng tín chỉ tương ứng trong ví của người
    * bán.
    *
    * @param dto    Thông tin bán (số lượng, giá...)
    * @param userId ID của người bán (lấy từ token)
    * @return Bài đăng vừa tạo
    */
ListingResponse createListing(ListingRequest listingRequest, String userId);

/**
    * Lấy danh sách các bài đăng ĐANG HOẠT ĐỘNG (ACTIVE) trên chợ.
    * Dành cho người mua xem.
    */
List<ListingResponse> getActiveListings();

/**
    * Lấy danh sách bài đăng CỦA TÔI.
    * Dành cho người bán quản lý (xem cả active, sold, cancelled).
    */
List<ListingResponse> getMyListings(String userId);

/**
    * Hủy bài đăng bán.
    * Hành động này sẽ MỞ KHÓA (Unlock) tín chỉ và trả về ví khả dụng.
    */
void cancelListing(Long listingId, String userId);

BidResponse placeBid(Long listingId, BigDecimal amount, String bidderId);

    void processExpiredAuctions();

}