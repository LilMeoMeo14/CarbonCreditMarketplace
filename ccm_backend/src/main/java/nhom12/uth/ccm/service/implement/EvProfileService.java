package nhom12.uth.ccm.service.implement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.DocumentType;

import nhom12.uth.ccm.dto.request.EvProfileRequest;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.EvProfileMapper;
import nhom12.uth.ccm.model.EVProfile;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import nhom12.uth.ccm.model.enums.UserRole;
import nhom12.uth.ccm.repository.IEvDocumentRepository;
import nhom12.uth.ccm.repository.IEvProfileRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IEvProfileService;
import nhom12.uth.ccm.service.IStorageService;

@Service
@RequiredArgsConstructor
public class EvProfileService implements IEvProfileService {

    private final IUserRepository userRepository;
    private final IEvProfileRepository evProfileRepository;
    private final EvProfileMapper evProfileMapper;
    private final IEvDocumentRepository evDocumentRepository;
    private final FileStorageService fileStorageService;

    private final IStorageService storageService;

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
        // Debug
        // System.out.println(evProfile.getLicensePlate());
        return evProfileMapper.toEvProfileResponse(evProfileRepository.save(evProfile));
    }

    @Override
    public List<EvProfileResponse> getAllEvProfile(String userId) {
        List<EVProfile> evProfiles = evProfileRepository.findByUser_UserId(userId);
        return evProfiles.stream()
                .map(evProfileMapper::toEvProfileResponse)
                .collect(Collectors.toList());

    }

    @Override
    public EvProfileResponse getEvProfileById(Long evProfileId, String userId) {
        EVProfile profile = evProfileRepository.findByEvProfileIdAndUser_UserId(evProfileId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));

        return evProfileMapper.toEvProfileResponse(profile);
    }

    @Override
    public EvProfileResponse updateEvProfle(Long profileId, EvProfileRequest evProfileRequest, String userId) {
        EVProfile existingProfile = evProfileRepository.findByEvProfileIdAndUser_UserId(profileId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));

        evProfileMapper.updateEvProfile(existingProfile, evProfileRequest);

        // sau khi cap nhat thong tin thi o trang thai pending de cva duyet
        existingProfile.setVerificationStatus(VerificationStatus.PENDING);

        EVProfile updatedProfile = evProfileRepository.save(existingProfile);

        return evProfileMapper.toEvProfileResponse(updatedProfile);
    }

    @Override
    public void deleteEvProfile(Long evProfileId, String userId) {
        EVProfile profile = evProfileRepository.findByEvProfileIdAndUser_UserId(evProfileId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));

        evProfileRepository.delete(profile);
    }

    public EvProfileResponse verifyEvProfile(Long profileId, VerificationStatus status, String verifierId) {
        EVProfile profile = evProfileRepository.findById(profileId)
            .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));

        User verifier = userRepository.findById(verifierId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    // Kiểm tra quyền: chỉ CVA hoặc ADMIN mới được verify
    if (!(verifier.getUserRole() == UserRole.CVA || verifier.getUserRole() == UserRole.ADMIN)) {
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    if (status == VerificationStatus.PENDING) {
        throw new AppException(ErrorCode.INVALID_VERIFICATION_STATUS);
    }

    profile.setVerificationStatus(status);
    EVProfile updated = evProfileRepository.save(profile);

    return evProfileMapper.toEvProfileResponse(updated);
}

    public EvDocument uploadDocument(Long profileId, MultipartFile file, EvDocumentType type, String userId) {
        EVProfile profile = evProfileRepository.findByEvProfileIdAndUser_UserId(profileId, userId)
            .orElseThrow(() -> new AppException(ErrorCode.EV_PROFILE_NOT_FOUND));

    // Lưu file bằng FileStorageService từ Vũ
    String fileUrl = fileStorageService.storeFile(file, "ev-docs/" + profileId);

    EvDocument document = new EvDocument();
    document.setEvProfile(profile);
    document.setFileName(file.getOriginalFilename());
    document.setFileUrl(fileUrl);
    document.setType(type);
    document.setUploadedAt(LocalDateTime.now());

    return evDocumentRepository.save(document);
}



}
