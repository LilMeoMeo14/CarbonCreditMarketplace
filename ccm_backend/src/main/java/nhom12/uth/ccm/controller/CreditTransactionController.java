package nhom12.uth.ccm.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.response.CreditTransactionResponse;
import nhom12.uth.ccm.service.ITransactionService;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class CreditTransactionController extends BaseController {
    private final ITransactionService transactionService;

    @PostMapping("/buy-now/{listingId}")
    public ApiRespone<CreditTransactionResponse> buyNow(
            @PathVariable Long listingId,
            @RequestParam BigDecimal amount) {

        String buyerId = getAuthenticatedUserId();

        CreditTransactionResponse result = transactionService.buyNow(listingId, amount, buyerId);

        return ApiRespone.<CreditTransactionResponse>builder()
                .result(result)
                .message("Mua thành công! Tín chỉ đã được chuyển vào ví của bạn.")
                .build();
    }

    @GetMapping("/history/purchases")
    public ApiRespone<List<CreditTransactionResponse>> getMyPurchases() {
        String userId = getAuthenticatedUserId();
        return ApiRespone.<List<CreditTransactionResponse>>builder()
                .result(transactionService.getMyPurchaseHistory(userId))
                .build();
    }

    @GetMapping("/history/sales")
    public ApiRespone<List<CreditTransactionResponse>> getMySales() {
        String userId = getAuthenticatedUserId();
        return ApiRespone.<List<CreditTransactionResponse>>builder()
                .result(transactionService.getMySalesHistory(userId))
                .build();
    }

}