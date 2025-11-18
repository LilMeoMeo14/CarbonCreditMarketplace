package nhom12.uth.ccm.dto.request;

import nhom12.uth.ccm.model.enums.VerificationStatus;

public class VerifyRequest {
    private VerificationStatus status;
    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }
    
}
