package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.response.CarbonWalletResponse;
import nhom12.uth.ccm.model.User;

public interface ICarbonWalletService {

    // tao vi moi khi register
    void createWalletForUser(User user);

    // xem vi cua chinh minhf
    CarbonWalletResponse getMyWallet(String userId);
}
