package nhom12.uth.ccm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import nhom12.uth.ccm.service.ICVAService;
import nhom12.uth.ccm.service.IEvProfileService;

@RestController
@RequestMapping("/cva")
@RequiredArgsConstructor
public class CVAController extends BaseController {
    private final ICVAService cvaService;
    private final IEvProfileService evProfileService;

    // duyet yeu cau
    @PostMapping("/requests/{requestId}/approve")
    public ApiRespone<String> approveRequest(
            @PathVariable Long requestId,
            @RequestParam(required = false) String note) {

        String cva = getAuthenticatedUserId();

        cvaService.approveRequest(requestId, cva, note);

        return ApiRespone.<String>builder()
                .result("Request approved successfully. Credits issued to owner's wallet.")
                .build();
    }

    // tu choi yeu cau
    @PostMapping("/requests/{requestId}/reject")
    public ApiRespone<String> rejectRequest(
            @PathVariable Long requestId,
            @RequestParam String reason) {

        String cva = getAuthenticatedUserId();

        cvaService.rejectRequest(requestId, cva, reason);

        return ApiRespone.<String>builder()
                .result("Request rejected.")
                .build();
    }

    // duyet xe
    @PostMapping("/ev-profile/{evProfileId}/approve")
    public ApiRespone<String> approveEvProfile(@PathVariable Long evProfileId) {
        evProfileService.verifyEvprofile(evProfileId, VerificationStatus.APPROVED);
        return ApiRespone.<String>builder()
                .result("EV Profile verified successfully (APPROVED).")
                .build();
    }

    // tu choi xe
    @PostMapping("/ev-profile/{evProfileId}/reject")
    public ApiRespone<String> rejectEvProfile(@PathVariable Long evProfileId) {
        evProfileService.verifyEvprofile(evProfileId, VerificationStatus.REJECTED);
        return ApiRespone.<String>builder()
                .result("EV Profile rejected.")
                .build();
    }
}