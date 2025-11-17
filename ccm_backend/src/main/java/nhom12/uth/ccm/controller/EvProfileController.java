package nhom12.uth.ccm.controller;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.request.CarbonSavingRequest;
import nhom12.uth.ccm.dto.request.EvProfileRequest;
import nhom12.uth.ccm.dto.response.CarbonSavingResponse;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICarbonSavingService;
import nhom12.uth.ccm.service.IEvProfileService;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/ev-profiles")
@RequiredArgsConstructor
public class EvProfileController {
    private final IEvProfileService evProfileService;
    private final IUserRepository userRepository;
    private final ICarbonSavingService carbonSavingService;

    // debug
    // private static final Logger log =
    // LoggerFactory.getLogger(EvProfileController.class);
    @PostMapping
    public ApiRespone<EvProfileResponse> createEvProfile(@RequestBody @Valid EvProfileRequest evProfileRequest) {
        // debug
        // log.info("====> 1. CONTROLLER: Received EvProfileRequest: {}",
        // evProfileRequest.toString());

        // lay userid
        String userId = getAuthenticatedUserId();
        EvProfileResponse evProfileResponse = evProfileService.createEvProfile(evProfileRequest, userId);

        return ApiRespone.<EvProfileResponse>builder()
                .result(evProfileResponse)
                .code(1000)
                .build();
    }

    // lay tat ca xe user dang nhap
    @GetMapping("/my-vehicles")
    public ApiRespone<List<EvProfileResponse>> getAllEvProfiles() {
        String userId = getAuthenticatedUserId();
        List<EvProfileResponse> listEvProfileResponses = evProfileService.getAllEvProfile(userId);
        return ApiRespone.<List<EvProfileResponse>>builder()
                .result(listEvProfileResponses)
                .build();
    }

    // lay xe theo id
    @GetMapping("/{profileId}")
    public ApiRespone<EvProfileResponse> getEvProfileById(
            @PathVariable Long profileId) {

        String userId = getAuthenticatedUserId();

        EvProfileResponse result = evProfileService.getEvProfileById(profileId, userId);
        return ApiRespone.<EvProfileResponse>builder().result(result).build();
    }

    // update profile
    @PutMapping("/{profileId}")
    public ApiRespone<EvProfileResponse> updateEvProfile(
            @PathVariable Long profileId,
            @RequestBody @Valid EvProfileRequest evProfileRequest) {

        String userId = getAuthenticatedUserId();

        EvProfileResponse result = evProfileService.updateEvProfle(profileId, evProfileRequest, userId);
        return ApiRespone.<EvProfileResponse>builder().result(result).build();
    }

    // xoa profile
    @DeleteMapping("/{profileId}")
    public ApiRespone<String> deleteEvProfile(@PathVariable Long profileId) {

        String userId = getAuthenticatedUserId();

        evProfileService.deleteEvProfile(profileId, userId);
        return ApiRespone.<String>builder().result("EV Profile deleted successfully.").build();
    }

    // Carbon saving // theo dõi phát thải

    /*
     * API Gửi báo cáo quãng đường (tạo Carbon Saving) cho 1 xe.
     */
    @PostMapping("/{profileId}/carbon-saving")
    public ApiRespone<CarbonSavingResponse> createCarbonSaving(@PathVariable Long profileId,
            @RequestBody @Valid CarbonSavingRequest carbonSavingRequest) {

        // lay user tu token

        String userId = getAuthenticatedUserId();

        CarbonSavingResponse carbonSavingResponse = carbonSavingService.createCarbonSaving(profileId,
                carbonSavingRequest, userId);
        return ApiRespone.<CarbonSavingResponse>builder()
                .result(carbonSavingResponse)
                .build();
    }

    /*
     * API lấy tất cả bản ghi carbon savings của 1 xe
     */

    @GetMapping("/{profileId}/carbon-saving")
    public ApiRespone<List<CarbonSavingResponse>> getCarbonSavingsForProfile(@PathVariable Long profileId) {
        String userId = getAuthenticatedUserId();
        List<CarbonSavingResponse> carbonSavingResponses = carbonSavingService.getCarbonSavingsForProfile(profileId,
                userId);
        return ApiRespone.<List<CarbonSavingResponse>>builder()
                .result(carbonSavingResponses)
                .build();
    }

    // lay userId tu token
    private String getAuthenticatedUserId() {
        // lay thong tin xac thuc tu spring security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // kiem tra xem co ai dang dang nhap khong

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return user.getUserId();
    }
}
