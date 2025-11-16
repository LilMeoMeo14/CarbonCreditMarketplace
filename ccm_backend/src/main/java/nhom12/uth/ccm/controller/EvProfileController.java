package nhom12.uth.ccm.controller;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.request.EvProfileRequest;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IEvProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/ev-profiles")
@RequiredArgsConstructor
public class EvProfileController {
    private final IEvProfileService evProfileService;
    private final IUserRepository userRepository;

    // debug
    private static final Logger log = LoggerFactory.getLogger(EvProfileController.class);
    @PostMapping
    public ApiRespone<EvProfileResponse> createEvProfile(@RequestBody @Valid EvProfileRequest evProfileRequest) {
        log.info("====> 1. CONTROLLER: Received EvProfileRequest: {}", evProfileRequest.toString());

        // lay userid
        String userId = getAuthenticatedUserId();
        EvProfileResponse evProfileResponse = evProfileService.createEvProfile(evProfileRequest, userId);

        return ApiRespone.<EvProfileResponse>builder()
                .result(evProfileResponse)
                .code(1000)
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
