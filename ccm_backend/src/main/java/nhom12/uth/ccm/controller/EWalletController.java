package nhom12.uth.ccm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;
import nhom12.uth.ccm.service.IEWalletService;

@RestController
@RequestMapping("/e-wallets")
@RequiredArgsConstructor
public class EWalletController extends BaseController {
    private final IEWalletService eWalletService;

    // User gui yeu cau nap tien
    @PostMapping("/deposit-request")
    public ApiRespone<PaymentTransactionResponse> requestDeposit(@RequestBody @Valid DepositRequest request) {

        String userId = getAuthenticatedUserId();
        PaymentTransactionResponse result = eWalletService.requestDeposit(request, userId);

        return ApiRespone.<PaymentTransactionResponse>builder()
                .result(result)
                .message("Deposit request submitted. Please wait for Admin approval.")
                .build();
    }

    // Admin duyet yeu cau nap tien
    @PostMapping("/transactions/{transactionId}/approve")
    public ApiRespone<PaymentTransactionResponse> approveDeposit(@PathVariable Long transactionId) {

        PaymentTransactionResponse result = eWalletService.approveDeposit(transactionId);

        return ApiRespone.<PaymentTransactionResponse>builder()
                .result(result)
                .message("Transaction approved. Balance updated.")
                .build();
    }

    // Admin tu choi yeu cau
    @PostMapping("/transactions/{transactionId}/reject")
    public ApiRespone<PaymentTransactionResponse> rejectDeposit(@PathVariable Long transactionId) {

        PaymentTransactionResponse result = eWalletService.rejectDeposit(transactionId);

        return ApiRespone.<PaymentTransactionResponse>builder()
                .result(result)
                .message("Transaction rejected.")
                .build();
    }

}
