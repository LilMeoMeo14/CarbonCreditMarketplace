package nhom12.uth.ccm.dto.request;

import lombok.Data;
import nhom12.uth.ccm.model.enums.CertificateType;

/**
 * DTO: CertificateRequest
 * Dùng để nhận dữ liệu từ client khi tạo mới certificate.
 * Ví dụ: khi user phát hành tín chỉ carbon (ISSUED) hoặc mua tín chỉ carbon (PURCHASED).
 */
@Data
public class CertificateRequest {

    /**
     * Loại chứng chỉ:
     * - CARBON_CREDIT_ISSUED: phát hành tín chỉ carbon
     * - CARBON_CREDIT_PURCHASED: mua tín chỉ carbon
     */
    private CertificateType certificateType;

    /**
     * ID liên quan:
     * - Nếu là ISSUED → liên kết với creditId
     * - Nếu là PURCHASED → liên kết với transactionId
     */
    private Integer relatedId;

    /**
     * Lượng CO₂ tương ứng (kg).
     * Client gửi lên để server tạo certificate với giá trị này.
     */
    private String co2AmountKg;
}
