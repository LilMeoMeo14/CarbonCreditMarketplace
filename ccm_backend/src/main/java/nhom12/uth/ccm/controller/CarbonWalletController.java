package nhom12.uth.ccm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.response.CarbonWalletResponse;
import nhom12.uth.ccm.service.ICarbonWalletService;

@RestController
@RequestMapping("/carbon-wallets")
@RequiredArgsConstructor
public class CarbonWalletController extends BaseController {
    private final ICarbonWalletService carbonWalletService;

    @GetMapping("/my-wallet")
    public ApiRespone<CarbonWalletResponse> getMyWallet() {
        String userId = getAuthenticatedUserId();
        CarbonWalletResponse carbonWalletResponse = carbonWalletService.getMyWallet(userId);
        return ApiRespone.<CarbonWalletResponse>builder()
                .result(carbonWalletResponse)
                .build();
    }
}
