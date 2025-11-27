package nhom12.uth.ccm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICVAService;

@RestController
@RequestMapping("/cva")
@RequiredArgsConstructor
public class CVAController {
    private final ICVAService cvaService;
    private final IUserRepository userRepository;
    private final EvProfileController evProfileController;

    // duyet yeu cau
    @PostMapping("/requests/{requestId}/approve")
    public ApiRespone<String> approveRequest(
            @PathVariable Long requestId,
            @RequestParam(required = false) String note) {

        String cva = evProfileController.getAuthenticatedUserId();

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

        String cva = evProfileController.getAuthenticatedUserId();

        cvaService.rejectRequest(requestId, cva, reason);

        return ApiRespone.<String>builder()
                .result("Request rejected.")
                .build();
    }
}