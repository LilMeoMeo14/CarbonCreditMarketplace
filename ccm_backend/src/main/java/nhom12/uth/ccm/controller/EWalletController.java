package nhom12.uth.ccm.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.request.WithDrawReqest;
import nhom12.uth.ccm.dto.response.EWalletResponse;
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

    // kiem tra tien trong vi

    @GetMapping("/my-wallet")
    public ApiRespone<EWalletResponse> getMyWallet() {
        String userId = getAuthenticatedUserId();
        EWalletResponse eWalletResponse = eWalletService.getMyWallet(userId);

        return ApiRespone.<EWalletResponse>builder()
                .result(eWalletResponse)
                .build();
    }

    // 1. User rút tiền
    @PostMapping("/withdraw-request")
    public ApiRespone<PaymentTransactionResponse> requestWithdraw(
            @RequestBody @Valid WithDrawReqest request) {

        String userId = getAuthenticatedUserId();
        PaymentTransactionResponse result = eWalletService.requestWithDraw(request, userId);

        return ApiRespone.<PaymentTransactionResponse>builder()
                .result(result)
                .message("Withdraw request submitted. Amount deducted.")
                .build();
    }

    // 2. Admin duyệt rút
    @PostMapping("/transactions/{transactionId}/approve-withdraw")
    public ApiRespone<PaymentTransactionResponse> approveWithdraw(@PathVariable Long transactionId) {
        PaymentTransactionResponse result = eWalletService.approveWithDraw(transactionId);
        return ApiRespone.<PaymentTransactionResponse>builder()
                .result(result)
                .message("Withdraw approved.")
                .build();
    }

    // 3. Admin từ chối rút
    @PostMapping("/transactions/{transactionId}/reject-withdraw")
    public ApiRespone<PaymentTransactionResponse> rejectWithdraw(
            @PathVariable Long transactionId,
            @RequestParam String reason) {

        PaymentTransactionResponse result = eWalletService.rejectWithDraw(transactionId, reason);
        return ApiRespone.<PaymentTransactionResponse>builder()
                .result(result)
                .message("Withdraw rejected. Money refunded.")
                .build();
    }

    // Lấy danh sách tất cả giao dịch đang PENDING
    @GetMapping("/transactions/pending")
    public ApiRespone<List<PaymentTransactionResponse>> getPendingTransactions() {

        List<PaymentTransactionResponse> result = eWalletService.getPendingTransactions();

        return ApiRespone.<List<PaymentTransactionResponse>>builder()
                .result(result)
                .message("Pending transactions fetched successfully")
                .build();
    }
}
