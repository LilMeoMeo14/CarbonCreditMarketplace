package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;

public interface IEWalletService {

    // tao giao dich nap tien khi user yeu cau
    PaymentTransactionResponse requestDeposit(DepositRequest depositRequest, String userId);

    // Admin duyet yeu cau + tien vao vi
    PaymentTransactionResponse approveDeposit(Long transactionId);

    // Admin tu choi yeu cau
    PaymentTransactionResponse rejectDeposit(Long transactionId);

    void createWallet(String userId);
}