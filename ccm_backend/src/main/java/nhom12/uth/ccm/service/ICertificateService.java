package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.response.CertificateResponse;
import nhom12.uth.ccm.model.enums.CertificateType;
import org.springframework.core.io.Resource;

import java.util.List;

public interface ICertificateService {

    /**
     * Lấy tất cả certificates của user đang đăng nhập.
     * - Dùng cho endpoint: GET /my
     */
    List<CertificateResponse> getMyCertificates(String userId);

    /**
     * Lấy danh sách certificates theo loại (ISSUED hoặc PURCHASED).
     * - Dùng cho endpoint: GET /list?type=ISSUED
     */
    List<CertificateResponse> getCertificatesByType(CertificateType type);

    /**
     * Lấy chi tiết một certificate theo ID.
     * - Dùng cho endpoint: GET /{certificateId}
     */
    CertificateResponse getCertificateDetail(Integer certificateId, String userId);

    /**
     * Download certificate dưới dạng PDF.
     * - Dùng cho endpoint: GET /{certificateId}/download
     */
    Resource downloadCertificate(Integer certificateId, String userId);

    /**
     * Logic: Tạo certificate khi issuance (phát hành tín chỉ carbon).
     */
    void createCertificateOnIssuance(Integer creditId, String userId);

    /**
     * Logic: Tạo certificate khi purchase (mua tín chỉ carbon).
     */
    void createCertificateOnPurchase(Integer transactionId, String userId);
}
