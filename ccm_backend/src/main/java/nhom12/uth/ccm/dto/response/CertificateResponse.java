package nhom12.uth.ccm.dto.response;

import lombok.Data;

/**
 * DTO: CertificateResponse
 * Dùng để trả dữ liệu certificate ra client.
 * Ví dụ: khi user gọi API GET /my hoặc GET /{certificateId}.
 */
@Data
public class CertificateResponse {

    /**
     * Khóa chính của certificate.
     * Dùng để định danh duy nhất mỗi chứng chỉ.
     */
    private Integer certificateId;

    /**
     * Số hiệu chứng chỉ (mã duy nhất).
     * Ví dụ: CERT-2025-0001
     */
    private String certificateNumber;

    /**
     * Loại chứng chỉ (ISSUED / PURCHASED).
     * Trả về dưới dạng String để client dễ hiển thị.
     */
    private String certificateType;

    /**
     * Ngày phát hành chứng chỉ.
     * Trả về dạng String (yyyy-MM-dd).
     */
    private String issueDate;

    /**
     * Lượng CO₂ tương ứng (kg).
     * Trả về dạng String để client hiển thị trực tiếp.
     */
    private String co2AmountKg;

    /**
     * Đường dẫn file PDF chứng chỉ.
     * Dùng cho endpoint download.
     */
    private String pdfUrl;
}
