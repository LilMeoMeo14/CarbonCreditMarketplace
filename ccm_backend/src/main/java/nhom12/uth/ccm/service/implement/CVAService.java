package nhom12.uth.ccm.service.implement;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.response.CarbonCreditResponse;
import nhom12.uth.ccm.dto.response.CreditRequestResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CarbonCreditMapper;
import nhom12.uth.ccm.mapper.CarbonCreditRequestMapper;
import nhom12.uth.ccm.model.CarbonCredit;
import nhom12.uth.ccm.model.CarbonCreditRequest;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.Certificate;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.CertificateType;
import nhom12.uth.ccm.model.enums.CreditStatus;
import nhom12.uth.ccm.model.enums.RequestStatus;
import nhom12.uth.ccm.repository.ICarbonCreditRepository;
import nhom12.uth.ccm.repository.ICarbonCreditRequestRepository;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.repository.ICertificateRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICVAService;

@Service
@RequiredArgsConstructor
public class CVAService implements ICVAService {

        private final ICarbonCreditRequestRepository carbonCreditRequestRepository;
        private final ICarbonCreditRepository carbonCreditRepository;
        private final ICarbonWalletRepository carbonWalletRepository;
        private final IUserRepository userRepository;
        private final ICertificateRepository certificateRepository;

        private final CarbonCreditMapper carbonCreditMapper;
        private final CarbonCreditRequestMapper carbonCreditRequestMapper;

        @Override
        @Transactional
        public CarbonCreditResponse approveRequest(Long requestId, String verifierId, String note) {
                /*
                 * Luồng hoạt động
                 * 1. Lấy thông tin cva
                 * 2. Lấy request cần duyệt
                 * 3. Kiểm tra trạng thái
                 * 4. Cập nhật trạng thái Request -> APPROVED
                 * 5. Tạo carbon credit mới
                 * 6. Cộng tiền vào ví
                 */

                User cva = userRepository.findById(verifierId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                CarbonCreditRequest carbonCreditRequest = carbonCreditRequestRepository.findById(requestId)
                                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

                if (carbonCreditRequest.getStatus() != RequestStatus.PENDING) {
                        throw new AppException(ErrorCode.INVALID_REQUEST_STATUS);
                }

                carbonCreditRequest.setStatus(RequestStatus.APPROVED);
                carbonCreditRequest.setVerifier(cva);
                carbonCreditRequest.setVerificationNote(note);
                carbonCreditRequest.setVerifiedDate(LocalDate.now());
                carbonCreditRequestRepository.save(carbonCreditRequest);

                carbonCreditRequestRepository.save(carbonCreditRequest);

                // tao tin chi
                CarbonCredit newCarbonCredit = CarbonCredit.builder()
                                .amount(carbonCreditRequest.getCo2AmountKg())
                                .user(carbonCreditRequest.getUser())
                                .request(carbonCreditRequest)
                                .status(CreditStatus.ACTIVE)
                                .build();

                CarbonCredit savedCredit = carbonCreditRepository.save(newCarbonCredit);

                CarbonWallet wallet = carbonWalletRepository
                                .findByUser_UserId(carbonCreditRequest.getUser().getUserId())
                                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));
                wallet.deposit(newCarbonCredit.getAmount());
                carbonWalletRepository.save(wallet);

                // auto make certificate
                Certificate issuanceCert = Certificate.builder()
                                .user(carbonCreditRequest.getUser())
                                .type(CertificateType.ISSUANCE)
                                .amount(newCarbonCredit.getAmount())
                                .issueDate(LocalDate.now())
                                .serialNumber("ISS-" + System.currentTimeMillis() + "-"
                                                + UUID.randomUUID().toString().substring(0, 4).toUpperCase())
                                .relatedId(savedCredit.getCreditId())
                                .reason("Phát hành tín chỉ từ yêu cầu #" + requestId)
                                .build();

                certificateRepository.save(issuanceCert);

                return carbonCreditMapper.toResponse(newCarbonCredit);
        }

        @Override
        @Transactional
        public CreditRequestResponse rejectRequest(Long requestId, String verifierId, String reason) {
                /*
                 * Luồng hoạt động
                 * 1. Lấy thông tin cva
                 * 2. Lấy request
                 * 3. Check status
                 * 4. Update status -> Rejected
                 */

                User cva = userRepository.findById(verifierId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                CarbonCreditRequest carbonCreditRequest = carbonCreditRequestRepository.findById(requestId)
                                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

                if (carbonCreditRequest.getStatus() != RequestStatus.PENDING) {
                        throw new AppException(ErrorCode.INVALID_REQUEST_STATUS);
                }

                carbonCreditRequest.setStatus(RequestStatus.REJECTED);
                carbonCreditRequest.setVerifier(cva);
                carbonCreditRequest.setVerificationNote(reason);
                carbonCreditRequest.setVerifiedDate(LocalDate.now());

                CarbonCreditRequest savedRequest = carbonCreditRequestRepository.save(carbonCreditRequest);

                return carbonCreditRequestMapper.toResponse(savedRequest);
        }

}