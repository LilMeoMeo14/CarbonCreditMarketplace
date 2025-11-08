package nhom12.uth.ccm;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Enum đại diện cho trạng thái của Yêu cầu Tín chỉ Carbon
enum RequestStatus {
    PENDING,
    APPROVED,
    REJECTED,
    PROCESSED
}

// Đại diện cho Yêu cầu Tín chỉ Carbon (Carbon Credit Request), quan hệ với User và EVProfile
public class CarbonCreditRequest {

    private Long requestId; // Khóa chính 
    private User user; // Người dùng tạo yêu cầu (Many-to-One)
    private EVProfile evProfile; // Hồ sơ EV liên quan (Many-to-One)
    private BigDecimal requestedAmount; // Số lượng tín chỉ carbon yêu cầu 
    private RequestStatus requestStatus; // Trạng thái của yêu cầu
    private String rejectionReason; // Lý do từ chối (nếu có)
    private LocalDateTime requestedAt; // Thời gian tạo yêu cầu
    private LocalDateTime processedAt; // Thời gian xử lý yêu cầu
    
    // Hàm khởi tạo mặc định
    public CarbonCreditRequest() {
    }

    // Hàm khởi tạo khi tạo yêu cầu mới
    public CarbonCreditRequest(User user, EVProfile evProfile, BigDecimal requestedAmount) {
        this.user = user;
        this.evProfile = evProfile;
        this.requestedAmount = requestedAmount;
        this.requestStatus = RequestStatus.PENDING;
        this.requestedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getRequestId() {
        return requestId;
    }

    public User getUser() {
        return user;
    }

    public EVProfile getEvProfile() {
        return evProfile;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public RequestStatus getRequestStatus() {
        return requestStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    // Setters
    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setEvProfile(EVProfile evProfile) {
        this.evProfile = evProfile;
    }

    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public void setRequestStatus(RequestStatus requestStatus) {
        this.requestStatus = requestStatus;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
}