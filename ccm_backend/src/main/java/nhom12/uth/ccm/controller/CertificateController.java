package nhom12.uth.ccm.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.request.RetireRequest;
import nhom12.uth.ccm.dto.response.CertificateResponse;
import nhom12.uth.ccm.service.ICertificateService;

@RestController
@RequestMapping("/certificate")
@RequiredArgsConstructor
public class CertificateController extends BaseController {
    private final ICertificateService certificateService;

    // đổi tín chỉ lấy chứng nhận
    @PostMapping("/retire")
    public ApiRespone<CertificateResponse> retireCredits(@RequestBody @Valid RetireRequest request) {
        String userId = getAuthenticatedUserId();

        CertificateResponse certificateResponse = certificateService.retireCredits(request, userId);

        return ApiRespone.<CertificateResponse>builder()
                .result(certificateResponse)
                .message("Credits retired successfully. Certificate issued.")
                .build();
    }

    // Kiểm tra tất cả các chứng nhận của tôi
    @GetMapping("/my-certificates")
    public ApiRespone<List<CertificateResponse>> getMyCertificates() {
        String userId = getAuthenticatedUserId();

        List<CertificateResponse> results = certificateService.getMyCertificate(userId);

        return ApiRespone.<List<CertificateResponse>>builder()
                .result(results)
                .build();
    }
}
