package nhom12.uth.ccm.mapper;

import nhom12.uth.ccm.dto.request.CertificateRequest;
import nhom12.uth.ccm.dto.response.CertificateResponse;
import nhom12.uth.ccm.model.Certificate;
import nhom12.uth.ccm.model.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Mapper: CertificateMapper
 * - Chuyển đổi giữa entity Certificate và DTO (Request/Response).
 * - Đảm bảo tách biệt tầng dữ liệu (entity) và tầng API (DTO).
 */
@Component
public class CertificateMapper {

    /**
     * Map từ entity Certificate → DTO CertificateResponse.
     * - Dùng khi trả dữ liệu certificate ra client (GET /my, GET /{id}).
     */
    public CertificateResponse toResponse(Certificate cert) {
        CertificateResponse dto = new CertificateResponse();
        dto.setCertificateId(cert.getCertificate_id());
        dto.setCertificateNumber(cert.getCertificate_number());
        dto.setCertificateType(cert.getCertificate_type().name()); // enum → String
        dto.setIssueDate(cert.getIssue_date().toString());
        dto.setCo2AmountKg(cert.getCo2_amount_kg().toPlainString());
        dto.setPdfUrl(cert.getPdf_url());
        return dto;
    }

    /**
     * Map từ DTO CertificateRequest → entity Certificate.
     * - Dùng khi client gửi request tạo mới certificate.
     * - Lưu ý: một số field như certificate_number, issue_date sẽ được service tự sinh,
     *   nên mapper chỉ set các field cơ bản từ request.
     */
    public Certificate toEntity(CertificateRequest request, User user) {
        Certificate cert = new Certificate();
        cert.setUser(user); // gắn certificate với user
        cert.setCertificate_type(request.getCertificateType());
        cert.setRelated_id(request.getRelatedId());
        cert.setCo2_amount_kg(new BigDecimal(request.getCo2AmountKg()));
        cert.setIssue_date(LocalDate.now()); // ngày phát hành mặc định là ngày hiện tại
        // certificate_number và pdf_url sẽ được service sinh thêm
        return cert;
    }
}
