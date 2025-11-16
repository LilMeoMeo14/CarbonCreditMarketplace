package nhom12.uth.ccm.service.implement;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import nhom12.uth.ccm.dto.request.EvProfileRequest;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.EvProfileMapper;
import nhom12.uth.ccm.model.EVProfile;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import nhom12.uth.ccm.repository.IEvProfileRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IEvProfileService;

@Service
@RequiredArgsConstructor
public class EvProfileService implements IEvProfileService {

    private final IUserRepository userRepository;
    private final IEvProfileRepository evProfileRepository;
    private final EvProfileMapper evProfileMapper;

    @Override
    public EvProfileResponse createEvProfile(EvProfileRequest evProfileRequest, String userId) {
        /*
         * Luồng hoạt động
         * 1. Kiểm tra user có tồn tại không
         * 2. Mapping dto voi entity
         * 3. Set profile đã mapping cho user
         * 4. Set status chờ duyệt cho profile
         * 5. Lưu vào db
         * 6.Map sang dto và trả về
         */

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        EVProfile evProfile = evProfileMapper.toEvProfile(evProfileRequest);

        evProfile.setUser(user);

        evProfile.setVerificationStatus(VerificationStatus.PENDING);
        System.out.println(evProfile.getLicensePlate());
        return evProfileMapper.toEvProfileResponse(evProfileRepository.save(evProfile));
    }

    @Override
    public List<EvProfileResponse> getAllEvProfile(EvProfileRequest evProfileRequest, String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllEvProfile'");
    }

    @Override
    public EvProfileResponse getEvProfileById(Long evProfileId, String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getEvProfileById'");
    }

    @Override
    public EvProfileResponse updateEvProfle(Long evProfileId, String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateEvProfle'");
    }

    @Override
    public void deleteEvProfile(Long evProfileId, String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteEvProfile'");
    }

}
