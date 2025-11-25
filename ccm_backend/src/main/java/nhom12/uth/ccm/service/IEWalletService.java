package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.request.WithdrawRequest;
import nhom12.uth.ccm.dto.response.BalanceResponse;
import nhom12.uth.ccm.dto.response.EWalletResponse;
import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;

import java.util.List;
import java.util.Map;

public interface IEWalletService {

    /**
     * Get e-wallet info for current authenticated user
     * @param userId User ID from JWT token
     * @return EWalletResponse
     */
    EWalletResponse getEWalletByUserId(String userId);

    /**
     * Get balance of e-wallet
     * @param userId User ID from JWT token
     * @return BalanceResponse
     */
    BalanceResponse getBalance(String userId);

    /**
     * Get payment transaction history
     * @param userId User ID from JWT token
     * @return List of PaymentTransactionResponse
     */
    List<PaymentTransactionResponse> getHistory(String userId);

    /**
     * Deposit money to e-wallet
     * Creates PaymentTransaction with PENDING status
     * Does NOT update balance (balance updated via webhook)
     * @param userId User ID from JWT token
     * @param request DepositRequest
     * @return Map with payment URL and transaction info
     */
    Map<String, Object> deposit(String userId, DepositRequest request);

    /**
     * Withdraw money from e-wallet
     * Updates balance immediately
     * Creates PaymentTransaction with COMPLETED status
     * @param userId User ID from JWT token
     * @param request WithdrawRequest
     * @return PaymentTransactionResponse
     */
    PaymentTransactionResponse withdraw(String userId, WithdrawRequest request);

    /**
     * Create e-wallet for user if not exists
     * @param userId User ID
     * @return EWalletResponse
     */
    EWalletResponse createEWalletForUser(String userId);
}
