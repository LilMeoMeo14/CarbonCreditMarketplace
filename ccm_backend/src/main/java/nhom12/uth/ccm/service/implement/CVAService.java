package nhom12.uth.ccm.service.implement;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.response.CarbonCreditResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CarbonCreditMapper;
import nhom12.uth.ccm.mapper.CarbonCreditRequestMapper;
import nhom12.uth.ccm.model.CarbonCredit;
import nhom12.uth.ccm.model.CarbonCreditRequest;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.CreditStatus;
import nhom12.uth.ccm.model.enums.RequestStatus;
import nhom12.uth.ccm.repository.ICarbonCreditRepository;
import nhom12.uth.ccm.repository.ICarbonCreditRequestRepository;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICVAService;

@Service
@RequiredArgsConstructor
public class CVAService implements ICVAService {

    private final ICarbonCreditRequestRepository carbonCreditRequestRepository;
    private final ICarbonCreditRepository carbonCreditRepository;
    private final ICarbonWalletRepository carbonWalletRepository;
    private final IUserRepository userRepository;

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

        User cva = userRepository.findById(verifierId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

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

        CarbonCredit newCarbonCredit = CarbonCredit.builder()
                .amount(carbonCreditRequest.getCo2AmountKg())
                .user(carbonCreditRequest.getUser())
                .request(carbonCreditRequest)
                .status(CreditStatus.ACTIVE)
                .build();

        carbonCreditRepository.save(newCarbonCredit);

        CarbonWallet wallet = carbonWalletRepository.findByUser_UserId(carbonCreditRequest.getUser().getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));

        wallet.deposit(newCarbonCredit.getAmount());

        carbonWalletRepository.save(wallet);
        
        
        return carbonCreditMapper.toResponse(newCarbonCredit); }

    @Override
    @Transactional
    public void rejectRequest(Long requestId, String verifierId, String reason) {
        /*
         * Luồng hoạt động
         * 1. Lấy thông tin cva
         * 2. Lấy request
         * 3. Check status
         * 4. Update status -> Rejected
         */

        User cva = userRepository.findById(verifierId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        CarbonCreditRequest carbonCreditRequest = carbonCreditRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));

        if (carbonCreditRequest.getStatus() != RequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_REQUEST_STATUS);
        }

        carbonCreditRequest.setStatus(RequestStatus.REJECTED);
        carbonCreditRequest.setVerifier(cva);
        carbonCreditRequest.setVerificationNote(reason);
        carbonCreditRequest.setVerifiedDate(LocalDate.now());

        carbonCreditRequestRepository.save(carbonCreditRequest);
     
        carbonCreditRequestMapper.toResponse(carbonCreditRequest);
    }

}