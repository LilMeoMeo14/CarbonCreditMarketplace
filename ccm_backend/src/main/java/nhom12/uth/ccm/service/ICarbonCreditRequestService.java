package nhom12.uth.ccm.service;

import java.util.List;

import nhom12.uth.ccm.dto.request.CreditRequestRequest;
import nhom12.uth.ccm.dto.response.CreditRequestResponse;

public interface ICarbonCreditRequestService {
    /**
     * Tạo yêu cầu phát hành tín chỉ mới.
     * Hệ thống sẽ tự động gom tất cả các Saving (đã duyệt) của xe này lại.
     *
     * @param dto    Chứa ID của xe (evProfileId)
     * @param userId ID của chủ xe (lấy từ token)
     * @return Thông tin yêu cầu vừa tạo
     */
    CreditRequestResponse createCreditRequest(CreditRequestRequest creditRequestRequest, String userId);

    /**
     * Xem lịch sử các yêu cầu đã gửi của tôi.
     *
     * @param userId ID của chủ xe
     * @return Danh sách yêu cầu
     */
    List<CreditRequestResponse> getMyCreditRequests(String userId);
}