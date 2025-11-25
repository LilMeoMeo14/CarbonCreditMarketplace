package nhom12.uth.ccm.service;

public interface ICVAService {

    /**
     * Duyệt yêu cầu phát hành tín chỉ.
     * Hành động này sẽ:
     * 1. Chuyển trạng thái Request -> APPROVED
     * 2. Tạo ra Tín chỉ (Carbon Credit)
     * 3. Cộng tiền vào Ví (Carbon Wallet) của EV Owner
     * * @param requestId ID của yêu cầu
     * 
     * @param verifierId ID của CVA (người duyệt)
     * @param note       Ghi chú (nếu có)
     */
    void approveRequest(Long requestId, String verifierId, String note);

    /**
     * Từ chối yêu cầu.
     * Hành động này chỉ chuyển trạng thái Request -> REJECTED
     */
    void rejectRequest(Long requestId, String verifierId, String reason);
}