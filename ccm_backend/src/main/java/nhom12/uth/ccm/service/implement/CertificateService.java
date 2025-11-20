package nhom12.uth.ccm.service.implement;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.response.CertificateResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CertificateMapper;
import nhom12.uth.ccm.model.Certificate;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.CertificateType;
import nhom12.uth.ccm.repository.ICertificateRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICertificateService;
import nhom12.uth.ccm.service.PdfGenerationService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService implements ICertificateService {

    // Repository để truy vấn dữ liệu certificate từ DB
    private final ICertificateRepository certificateRepository;

    // Repository để truy vấn thông tin user (khi tạo certificate cần gắn với user)
    private final IUserRepository userRepository;

    // Mapper để chuyển entity Certificate → DTO CertificateResponse
    private final CertificateMapper certificateMapper;

    // Service phụ trách sinh file PDF từ dữ liệu certificate
    private final PdfGenerationService pdfGenerationService;

    /**
     * Lấy tất cả certificates của user đang đăng nhập.
     * - Dùng cho endpoint: GET /my
     */
    @Override
    public List<CertificateResponse> getMyCertificates(String userId) {
        return certificateRepository.findByUser_UserId(userId)
                .stream()
                .map(certificateMapper::toResponse) // map sang DTO để trả về client
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách certificates theo loại (ISSUED hoặc PURCHASED).
     * - Dùng cho endpoint: GET /list?type=ISSUED
     */
    @Override
    public List<CertificateResponse> getCertificatesByType(CertificateType type) {
        return certificateRepository.findByCertificateType(type)
                .stream()
                .map(certificateMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết một certificate theo ID.
     * - Dùng cho endpoint: GET /{certificateId}
     * - Kiểm tra certificate có thuộc về user đang đăng nhập không
     */
    @Override
    public CertificateResponse getCertificateDetail(Integer certificateId, String userId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .filter(c -> c.getUser().getUserId().equals(userId)) // chỉ cho phép xem certificate của chính mình
                .orElseThrow(() -> new AppException(ErrorCode.CERTIFICATE_NOT_FOUND));
        return certificateMapper.toResponse(cert);
    }

    /**
     * Download certificate dưới dạng PDF.
     * - Dùng cho endpoint: GET /{certificateId}/download
     * - Gọi PdfGenerationService để sinh file PDF từ dữ liệu certificate
     */
    @Override
    public Resource downloadCertificate(Integer certificateId, String userId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .filter(c -> c.getUser().getUserId().equals(userId))
                .orElseThrow(() -> new AppException(ErrorCode.CERTIFICATE_NOT_FOUND));

        // Sinh file PDF từ dữ liệu certificate
        byte[] pdf = pdfGenerationService.generateCertificatePdf(cert);

        // Trả về dưới dạng Resource để controller gửi file cho client
        return new ByteArrayResource(pdf);
    }

    /**
     * Logic: Tạo certificate khi issuance (phát hành tín chỉ carbon).
     * - Gắn certificate với user
     * - Loại: ISSUED
     * - related_id: id của credit vừa phát hành
     */
    @Override
    public void createCertificateOnIssuance(Integer creditId, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Certificate cert = Certificate.builder()
                .user(user)
                .certificate_type(CertificateType.CARBON_CREDIT_ISSUED)
                .related_id(creditId)
                .co2_amount_kg(new BigDecimal("100.00")) // ví dụ, sau này lấy từ credit thực tế
                .issue_date(LocalDate.now())
                .certificate_number("CERT-" + System.currentTimeMillis()) // sinh số hiệu duy nhất
                .build();

        certificateRepository.save(cert);
    }

    /**
     * Logic: Tạo certificate khi purchase (mua tín chỉ carbon).
     * - Gắn certificate với user
     * - Loại: PURCHASED
     * - related_id: id của transaction vừa mua
     */
    @Override
    public void createCertificateOnPurchase(Integer transactionId, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Certificate cert = Certificate.builder()
                .user(user)
                .certificate_type(CertificateType.CARBON_CREDIT_PURCHASED)
                .related_id(transactionId)
                .co2_amount_kg(new BigDecimal("50.00")) // ví dụ, sau này lấy từ transaction thực tế
                .issue_date(LocalDate.now())
                .certificate_number("CERT-" + System.currentTimeMillis())
                .build();

        certificateRepository.save(cert);
    }
}
