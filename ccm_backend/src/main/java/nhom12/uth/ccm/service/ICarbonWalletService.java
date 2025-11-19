package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.response.CarbonWalletResponse;

public interface ICarbonWalletService {

    /**
     * Get carbon wallet info for current authenticated user
     * @param userId User ID from JWT token
     * @return CarbonWalletResponse
     */
    CarbonWalletResponse getCarbonWalletByUserId(String userId);

    /**
     * Create carbon wallet for user if not exists
     * @param userId User ID
     * @return CarbonWalletResponse
     */
    CarbonWalletResponse createCarbonWalletForUser(String userId);
}
