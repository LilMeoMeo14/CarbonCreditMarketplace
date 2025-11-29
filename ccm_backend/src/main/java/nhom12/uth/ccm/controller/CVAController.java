package nhom12.uth.ccm.controller;

import nhom12.uth.ccm.dto.response.CarbonSavingResponse;
import nhom12.uth.ccm.dto.response.CreditRequestResponse;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
import nhom12.uth.ccm.service.IReportService;

import java.util.List;

@RestController
@RequestMapping("/cva")
@RequiredArgsConstructor
public class CVAController extends BaseController {
        private final ICVAService cvaService;
        private final IEvProfileService evProfileService;
        private final IReportService reportService;

        /**
         * API: Lấy danh sách các Hồ sơ xe đang chờ duyệt (PENDING).
         * URL: GET /cva/pending-profiles
         */
        @GetMapping("/pending-profiles")
        public ApiRespone<List<EvProfileResponse>> getPendingProfiles() {
                List<EvProfileResponse> results = cvaService.getPendingEvProfiles();

                return ApiRespone.<List<EvProfileResponse>>builder()
                                .result(results)
                                .build();
        }

        /**
         * API: Lấy danh sách các Yêu cầu tín chỉ đang chờ duyệt (PENDING).
         * URL: GET /cva/pending-requests
         */
        @GetMapping("/pending-requests")
        public ApiRespone<List<CreditRequestResponse>> getPendingRequests() {
                List<CreditRequestResponse> results = cvaService.getPendingRequests();

                return ApiRespone.<List<CreditRequestResponse>>builder()
                                .result(results)
                                .build();
        }

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

        // xuat bao cao phat hanh tin chi
        @GetMapping("/issuance/download")
        public ResponseEntity<Resource> downloadIssuanceReport() {
                String cva = getAuthenticatedUserId();
                String fileName = "bao_cao_phat_hanh_tin_chi.csv";

                InputStreamResource file = new InputStreamResource(reportService.exportIssuanceReport(cva));

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                                .contentType(MediaType.parseMediaType("application/csv"))
                                .body(file);
        }

        // kiem tra ho so tin chi va phat thai
        @GetMapping("/requests/{requestId}/savings")
        public ApiRespone<List<CarbonSavingResponse>> getRequestSavings(
                        @PathVariable Long requestId) {

                List<CarbonSavingResponse> results = cvaService.getRequestSavings(requestId);

                return ApiRespone.<List<CarbonSavingResponse>>builder()
                                .result(results)
                                .build();
        }

        // duyet hoac tu choi ban ghi tiet kiem
        @PostMapping("/savings/{savingId}/verify")
        public ApiRespone<String> verifySaving(
                        @PathVariable Long savingId,
                        @RequestParam VerificationStatus status,
                        @RequestParam(required = false) String note) {

                String verifierId = getAuthenticatedUserId();

                cvaService.verifySaving(savingId, verifierId, status, note);

                return ApiRespone.<String>builder()
                                .result("Saving verification updated to " + status)
                                .build();
        }

        // lay cac carbon saving dang cho duyet
        @GetMapping("/pending-savings")
        public ApiRespone<List<CarbonSavingResponse>> getPendingSavings() {
                List<CarbonSavingResponse> results = cvaService.getPendingSavings();

                return ApiRespone.<List<CarbonSavingResponse>>builder()
                                .result(results)
                                .build();
        }
}
