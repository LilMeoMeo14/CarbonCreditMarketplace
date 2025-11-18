package nhom12.uth.ccm.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.DocumentType;

import nhom12.uth.ccm.dto.request.EvProfileRequest;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import nhom12.uth.ccm.model.EvDocument;
import nhom12.uth.ccm.model.enums.EvDocumentType;

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

    // Verify EV Profile
    EvProfileResponse verifyEvProfile(Long profileId, VerificationStatus status, String verifierId);

     // Upload document for EV Profile
    EvDocument uploadDocument(Long profileId, MultipartFile file, EvDocumentType type, String userId);

}
