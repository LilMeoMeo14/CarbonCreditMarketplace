package nhom12.uth.ccm.service.implement;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.RetireRequest;
import nhom12.uth.ccm.dto.response.CertificateResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CertificateMapper;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.Certificate;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.CertificateType;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.repository.ICertificateRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICertificateService;

@Service
@RequiredArgsConstructor
public class CertificateService implements ICertificateService {

    private final IUserRepository userRepository;
    private final ICarbonWalletRepository carbonWalletRepository;
    private final ICertificateRepository certificateRepository;

    private final CertificateMapper certificateMapper;

    @Override
    @Transactional
    public CertificateResponse retireCredits(RetireRequest retireRequest, String userId) {
        // 1. Lấy User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Lấy Ví Tín Chỉ (CarbonWallet)
        CarbonWallet wallet = carbonWalletRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));

        // 3. THỰC HIỆN TRỪ VÍ (Logic quan trọng nhất)
        // Gọi hàm withdraw trong Model CarbonWallet.
        // Nó sẽ tự kiểm tra số dư (Balance >= Amount).
        // Nếu không đủ -> Ném IllegalArgumentException.
        try {
            wallet.withdraw(retireRequest.getAmount());
        } catch (IllegalArgumentException e) {
            // Bắt lỗi số dư và ném ra lỗi API đẹp hơn
            throw new RuntimeException("Số dư tín chỉ không đủ để đổi chứng nhận.");
            // Hoặc dùng ErrorCode.INSUFFICIENT_CREDITS
        }

        // Lưu ví đã bị trừ tiền
        carbonWalletRepository.save(wallet);

        // 4. Tạo Chứng Nhận (Certificate)
        Certificate cert = Certificate.builder()
                .user(user)
                .amount(retireRequest.getAmount())
                .reason(retireRequest.getReason())
                .type(CertificateType.RETIREMENT) // Loại: Tiêu hủy
                .issueDate(LocalDate.now())
                .serialNumber(Certificate.generateSerialNumber()) // Sinh mã ngẫu nhiên
                .build();

        Certificate savedCert = certificateRepository.save(cert);

        // 5. Trả về DTO
        return certificateMapper.toResponse(savedCert);
    }

    @Override
    public List<CertificateResponse> getMyCertificate(String userId) {
        return certificateRepository.findByUser_UserIdOrderByIssueDateDesc(userId)
                .stream()
                .map(certificateMapper::toResponse)
                .collect(Collectors.toList());
    }

}