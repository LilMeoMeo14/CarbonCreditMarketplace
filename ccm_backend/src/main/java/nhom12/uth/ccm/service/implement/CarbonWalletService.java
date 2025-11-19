package nhom12.uth.ccm.service.implement;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.response.CarbonWalletResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.ICarbonWalletRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICarbonWalletService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CarbonWalletService implements ICarbonWalletService {

    private final ICarbonWalletRepository carbonWalletRepository;
    private final IUserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CarbonWalletResponse getCarbonWalletByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        CarbonWallet wallet = carbonWalletRepository.findByUser(user)
                .orElseGet(() -> createWalletForUser(user));

        return mapToResponse(wallet);
    }

    @Override
    @Transactional
    public CarbonWalletResponse createCarbonWalletForUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if wallet already exists
        if (carbonWalletRepository.existsByUser(user)) {
            return getCarbonWalletByUserId(userId);
        }

        CarbonWallet wallet = createWalletForUser(user);
        return mapToResponse(wallet);
    }

    private CarbonWallet createWalletForUser(User user) {
        CarbonWallet wallet = new CarbonWallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        return carbonWalletRepository.save(wallet);
    }

    private CarbonWalletResponse mapToResponse(CarbonWallet wallet) {
        return CarbonWalletResponse.builder()
                .walletId(wallet.getWalletId())
                .userId(wallet.getUser().getUserId())
                .balance(wallet.getBalance())
                .createdAt(wallet.getCreatedAt())
                .updatedAt(wallet.getUpdatedAt())
                .build();
    }
}
