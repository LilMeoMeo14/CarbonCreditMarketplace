package nhom12.uth.ccm.service;

import java.util.List;

import nhom12.uth.ccm.dto.request.EvProfileRequest;
import nhom12.uth.ccm.dto.response.EvProfileResponse;

public interface IEvProfileService {

    // tao 1 evprofile cho nguoi dung moi dang nhap
    EvProfileResponse createEvProfile(EvProfileRequest evProfileRequest, String userId);

    // lay tat ca cac xe cua user
    List<EvProfileResponse> getAllEvProfile(String userId);

    // lay 1 ho so xe theo Id
    EvProfileResponse getEvProfileById(Long evProfileId, String userId);

    // cap nhat 1 ho so xe theo id
    EvProfileResponse updateEvProfle(Long profileId, EvProfileRequest evProfileRequest, String userId);

    // Xoa ho so 1 xe
    void deleteEvProfile(Long evProfileId, String userId);

}
