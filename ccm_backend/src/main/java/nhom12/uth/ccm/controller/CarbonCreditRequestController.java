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
import nhom12.uth.ccm.dto.request.CreditRequestRequest;
import nhom12.uth.ccm.dto.response.CreditRequestResponse;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICarbonCreditRequestService;

@RestController
@RequestMapping("/credit-requests")
@RequiredArgsConstructor
public class CarbonCreditRequestController {

    private final ICarbonCreditRequestService carbonCreditRequestService;
    private final IUserRepository userRepository;
    private final EvProfileController evProfileController;

    @PostMapping
    public ApiRespone<CreditRequestResponse> createCreditRequest(
            @RequestBody @Valid CreditRequestRequest creditRequestRequest) {
        String userId = evProfileController.getAuthenticatedUserId();

        CreditRequestResponse creditRequestResponse = carbonCreditRequestService
                .createCreditRequest(creditRequestRequest, userId);

        return ApiRespone.<CreditRequestResponse>builder()
                .result(creditRequestResponse)
                .build();

    }

    @GetMapping("/my-requests")
    public ApiRespone<List<CreditRequestResponse>> getMyCreditRequest() {
        String userId = evProfileController.getAuthenticatedUserId();
        List<CreditRequestResponse> creditRequestResponses = carbonCreditRequestService.getMyCreditRequests(userId);

        return ApiRespone.<List<CreditRequestResponse>>builder()
                .result(creditRequestResponses)
                .build();
    }
}
