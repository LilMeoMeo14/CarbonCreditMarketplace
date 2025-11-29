package nhom12.uth.ccm.service.implement;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import nhom12.uth.ccm.dto.response.CarbonSavingResponse;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import nhom12.uth.ccm.mapper.CarbonSavingMapper;
import nhom12.uth.ccm.mapper.EvProfileMapper;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import nhom12.uth.ccm.repository.*;
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
import nhom12.uth.ccm.model.CarbonSaving;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.Certificate;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.CertificateType;
import nhom12.uth.ccm.model.enums.CreditStatus;
import nhom12.uth.ccm.model.enums.RequestStatus;
import nhom12.uth.ccm.service.ICVAService;

@Service
@RequiredArgsConstructor
public class CVAService implements ICVAService {

        private final ICarbonCreditRequestRepository carbonCreditRequestRepository;
        private final ICarbonCreditRepository carbonCreditRepository;
        private final ICarbonWalletRepository carbonWalletRepository;
        private final IUserRepository userRepository;
        private final ICertificateRepository certificateRepository;
        private final IEvProfileRepository evProfileRepository;
        private final EvProfileMapper evProfileMapper;
        private final CarbonSavingMapper carbonSavingMapper;
        private final CarbonCreditMapper carbonCreditMapper;
        private final CarbonCreditRequestMapper carbonCreditRequestMapper;
        private final ICarbonSavingRepository carbonSavingRepository;

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

        @Override
        public List<EvProfileResponse> getPendingEvProfiles() {
                return evProfileRepository.findByVerificationStatus(VerificationStatus.PENDING)
                                .stream()
                                .map(evProfileMapper::toEvProfileResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<CreditRequestResponse> getPendingRequests() {
                return carbonCreditRequestRepository.findByStatus(RequestStatus.PENDING)
                                .stream()
                                .map(carbonCreditRequestMapper::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<CarbonSavingResponse> getRequestSavings(Long requestId) {
                // 1. Tìm Request
                CarbonCreditRequest request = carbonCreditRequestRepository.findById(requestId)
                                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

                // 2. Lấy danh sách Saving từ Request và map sang DTO
                // (Lưu ý: Trong Model CarbonCreditRequest phải có List<CarbonSaving>
                // carbonSavings)
                return request.getCarbonSavings().stream()
                                .map(carbonSavingMapper::toResponse) // Đảm bảo tên hàm trong Mapper là toResponseDTO
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public void verifySaving(Long savingId, String verifierId, VerificationStatus status, String note) {
                // 1. Kiểm tra quyền CVA
                userRepository.findById(verifierId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                // 2. Tìm bản ghi Saving
                CarbonSaving saving = carbonSavingRepository.findById(savingId)
                                .orElseThrow(() -> new RuntimeException("Saving not found"));

                // 3. Chỉ được duyệt những cái đang PENDING
                if (saving.getStatus() != VerificationStatus.PENDING) {
                        throw new RuntimeException("Saving is not in PENDING status");
                }

                // 4. Kiểm tra trạng thái đích (Chỉ cho phép APPROVED hoặc REJECTED)
                if (status == VerificationStatus.PENDING) {
                        throw new RuntimeException("Cannot set status back to PENDING");
                }

                // 5. Cập nhật
                saving.setStatus(status);
                // (Optional: Lưu note vào saving nếu model có hỗ trợ)

                carbonSavingRepository.save(saving);
        }

        @Override
        public List<CarbonSavingResponse> getPendingSavings() {
                return carbonSavingRepository.findByStatus(VerificationStatus.PENDING)
                                .stream()
                                .map(carbonSavingMapper::toResponse)
                                .collect(Collectors.toList());
        }

}
