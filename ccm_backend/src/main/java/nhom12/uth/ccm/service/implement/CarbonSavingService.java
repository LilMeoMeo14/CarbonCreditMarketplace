package nhom12.uth.ccm.service.implement;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.CarbonSavingRequest;
import nhom12.uth.ccm.dto.response.CarbonSavingResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CarbonSavingMapper;
import nhom12.uth.ccm.model.CarbonSaving;
import nhom12.uth.ccm.model.EVProfile;
import nhom12.uth.ccm.repository.ICarbonSavingRepository;
import nhom12.uth.ccm.repository.IEvProfileRepository;
import nhom12.uth.ccm.service.ICarbonSavingService;

@Service
@RequiredArgsConstructor
public class CarbonSavingService implements ICarbonSavingService {

    // co2 thai ra tren km2
    private static final BigDecimal EMISSION_FACTOR_KG_PER_KM = new BigDecimal("0.15");
    private static final String CALCULATION_METHOD = "Standard_Emission_Factor_v1";

    private final IEvProfileRepository evProfileRepository;
    private final ICarbonSavingRepository carbonSavingRepository;
    private final CarbonSavingMapper carbonSavingMapper;

    @Override
    public CarbonSavingResponse createCarbonSaving(Long evProfileId, CarbonSavingRequest carbonSavingRequest,
            String userId) {
        /*
         * Luồng hoạt động
         * 1.Check user co so huu xe nay khong
         * 2.Tính toán co2 tiet kiem
         * 3.Create 1 bản ghi phát thải mới
         * 4. Lưu vào db
         * 5. Mapping sang respone
         */

        EVProfile evProfile = evProfileRepository.findByEvProfileIdAndUser_UserId(evProfileId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));

        BigDecimal co2Saved = carbonSavingRequest.getDistanceKm().multiply(EMISSION_FACTOR_KG_PER_KM);

        CarbonSaving carbonSaving = new CarbonSaving(
                evProfile,
                carbonSavingRequest.getDistanceKm(),
                co2Saved,
                CALCULATION_METHOD,
                carbonSavingRequest.getRecordedDate());

        return carbonSavingMapper.toResponse(carbonSavingRepository.save(carbonSaving));
    }

    @Override
    public List<CarbonSavingResponse> getCarbonSavingsForProfile(Long evProfileId, String userId) {

        /*
         * Luồng hoạt động
         * 1. Check user có sở hữu xe không
         * 2.Tìm tất cả carbon saving của xe
         * 3. chuyển sang dto trả về
         */

        EVProfile evProfile = evProfileRepository.findByEvProfileIdAndUser_UserId(evProfileId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));
        List<CarbonSaving> carbonSavings = carbonSavingRepository.findByEvProfile(evProfile);

        return carbonSavings.stream()
                .map(carbonSavingMapper::toResponse)
                .collect(Collectors.toList());
    }

}
