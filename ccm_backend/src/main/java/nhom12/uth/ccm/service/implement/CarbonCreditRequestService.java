package nhom12.uth.ccm.service.implement;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.CreditRequestRequest;
import nhom12.uth.ccm.dto.response.CreditRequestResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CarbonCreditRequestMapper;
import nhom12.uth.ccm.model.CarbonCreditRequest;
import nhom12.uth.ccm.model.CarbonSaving;
import nhom12.uth.ccm.model.EVProfile;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.RequestStatus;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import nhom12.uth.ccm.repository.ICarbonCreditRequestRepository;
import nhom12.uth.ccm.repository.ICarbonSavingRepository;
import nhom12.uth.ccm.repository.IEvProfileRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICarbonCreditRequestService;

@Service
@RequiredArgsConstructor
public class CarbonCreditRequestService implements ICarbonCreditRequestService {

    // defind ty le quy doi : 1000kg co2 = 1 tin chi carbon
    private static final BigDecimal KG_CO2_PER_CREDIT = new BigDecimal(1000);

    private final IUserRepository userRepository;
    private final IEvProfileRepository evProfileRepository;
    private final ICarbonSavingRepository carbonSavingRepository;
    private final ICarbonCreditRequestRepository carbonCreditRequestRepository;
    private final CarbonCreditRequestMapper creditRequestMapper;

    @Override
    @Transactional // anotation nay de dam bao tin toan ven (viec tao request + update saving phai
                   // cung thanh cong)
    public CreditRequestResponse createCreditRequest(CreditRequestRequest creditRequestRequest, String userId) {

        /*
         * Luồng hoạt động
         * 1.Check invalid User
         * 2. Check EvProfile co phai cua user nay khong
         * 3. Tim tat ca cac CarbonSaving da duoc duyet(approved) nhung chua tao request
         * 4. Tin toan Co2
         * 5. Doi ra tin chi
         * 6. Luu vao db va cap nhat cac Saving da nam trong request
         */

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        EVProfile evProfile = evProfileRepository
                .findByEvProfileIdAndUser_UserId(creditRequestRequest.getEvProfileId(), userId)
                .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));

        // kiem tra xe duoc duyet chua
        if (evProfile.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new AppException(ErrorCode.EV_PROFILE_NOT_VERIFIED);
        }

        List<CarbonSaving> availableSavings = carbonSavingRepository
                .findByEvProfileAndStatusAndCarbonCreditRequestIsNull(evProfile, VerificationStatus.APPROVED);

        // neu khong co Carbon Saving nao du dieu kien
        if (availableSavings.isEmpty()) {
            throw new AppException(ErrorCode.NO_AVAILABLE_SAVINGS);
        }

        // tin toan co2
        BigDecimal totalCo2 = BigDecimal.ZERO;

        for (CarbonSaving saving : availableSavings) {
            totalCo2 = totalCo2.add(saving.getCo2SavedKg());
        }

        // quy doi ra tin chi
        BigDecimal totalCredits = BigDecimal.ZERO;
        if (totalCo2.compareTo(totalCredits) > 0) {
            totalCredits = totalCo2.divide(KG_CO2_PER_CREDIT, 2, RoundingMode.HALF_UP);
        }

        CarbonCreditRequest carbonCreditRequest = CarbonCreditRequest.builder()
                .user(user)
                .evProfile(evProfile)
                .co2AmountKg(totalCo2)
                .creditAmount(totalCredits)
                .status(RequestStatus.PENDING)
                .build();

        CarbonCreditRequest savedRequest = carbonCreditRequestRepository.save(carbonCreditRequest);

        // cap nhat cac saving , danh dau rang da nam trong request nay

        for (CarbonSaving saving : availableSavings) {
            saving.setCarbonCreditRequest(savedRequest);
            carbonSavingRepository.save(saving);
        }

        return creditRequestMapper.toResponse(savedRequest);
    }

    // func nay se lay danh danh theo userId va convert sang dto
    @Override
    public List<CreditRequestResponse> getMyCreditRequests(String userId) {
        List<CarbonCreditRequest> carbonCreditRequests = carbonCreditRequestRepository.findByUser_UserId(userId);

        // convert sang dto
        return carbonCreditRequests.stream().map(creditRequestMapper::toResponse).collect(Collectors.toList());
    }

}
