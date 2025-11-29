package nhom12.uth.ccm.service;

import java.util.List;

import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.request.WithDrawReqest;
import nhom12.uth.ccm.dto.response.EWalletResponse;
import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;

public interface IEWalletService {

    // tao giao dich nap tien khi user yeu cau
    PaymentTransactionResponse requestDeposit(DepositRequest depositRequest, String userId);

    // Admin duyet yeu cau + tien vao vi
    PaymentTransactionResponse approveDeposit(Long transactionId);

    // Admin tu choi yeu cau
    PaymentTransactionResponse rejectDeposit(Long transactionId);

    // giao dich rut tien //

    // gui yeu cau rut tien
    PaymentTransactionResponse requestWithDraw(WithDrawReqest withDrawReqest, String userId);

    // admin duyet rut tien
    PaymentTransactionResponse approveWithDraw(Long transactionId);

    // admin tu choi rut tien
    PaymentTransactionResponse rejectWithDraw(Long transactionId, String reason);

    void createWallet(String userId);
    // lay tien hien tai co trong vi

    EWalletResponse getMyWallet(String userId);

    // lay tat ca giao dich dang o trang thai pending
    List<PaymentTransactionResponse> getPendingTransactions();

}
