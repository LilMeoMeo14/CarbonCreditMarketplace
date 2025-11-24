package nhom12.uth.ccm.service.implement;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.response.CarbonWalletResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.CarbonWalletMapper;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.service.ICarbonWalletService;

@Service
@RequiredArgsConstructor
public class CarbonWalletService implements ICarbonWalletService {

    private final ICarbonWalletRepository carbonWalletRepository;
    private final CarbonWalletMapper carbonWalletMapper;

    @Override
    public void createWalletForUser(User user) {
        CarbonWallet carbonWallet = new CarbonWallet();
        carbonWallet.setUser(user);
        carbonWallet.setBalance(BigDecimal.ZERO);

        // luu vao db
        carbonWalletRepository.save(carbonWallet);
    }

    @Override
    public CarbonWalletResponse getMyWallet(String userId) {
        CarbonWallet carbonWallet = carbonWalletRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CARBON_WALLET_NOT_FOUND));
        return carbonWalletMapper.toResponse(carbonWallet);
    }

}
