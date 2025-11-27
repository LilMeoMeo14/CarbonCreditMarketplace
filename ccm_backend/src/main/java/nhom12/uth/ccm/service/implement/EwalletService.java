package nhom12.uth.ccm.service.implement;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.PaymentTransactionMapper;
import nhom12.uth.ccm.model.EWallet;
import nhom12.uth.ccm.model.PaymentTransaction;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.PaymentStatus;
import nhom12.uth.ccm.model.enums.PaymentType;
import nhom12.uth.ccm.repository.IEWalletRepository;
import nhom12.uth.ccm.repository.IPaymentTransactionRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IEWalletService;

@Service
@RequiredArgsConstructor
public class EWalletService implements IEWalletService {

private final IEWalletRepository eWalletRepository;
private final IPaymentTransactionRepository transactionRepository;
private final IUserRepository userRepository;
private final PaymentTransactionMapper transactionMapper;

@Override
@Transactional
public PaymentTransactionResponse approveDeposit(Long transactionId) {
/*
        * Luồng hoạt động
        * 1.Tìm wallet
        * 2.Cộng tiền
        * 3. Tạo transaction
        * 4. Lưu Transaction
        * 5.Tra ve dto
        */

PaymentTransaction transaction = transactionRepository.findById(transactionId)
.orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

// Validate
if (transaction.getStatus() != PaymentStatus.PENDING) {
throw new RuntimeException("Transaction is not pending");
}
if (transaction.getType() != PaymentType.DEPOSIT) {
throw new RuntimeException("Only DEPOSIT can be approved via this function");
}

// CỘNG TIỀN VÀO VÍ
EWallet wallet = transaction.getEWallet();
wallet.deposit(transaction.getAmount());
eWalletRepository.save(wallet);

// Cập nhật trạng thái -> COMPLETED
transaction.setStatus(PaymentStatus.COMPLETED);
transaction.setDescription(transaction.getDescription() + " [APPROVED BY ADMIN]");

return transactionMapper.toResponse(transactionRepository.save(transaction));
}

@Override
public void createWallet(String userId) {
User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

EWallet wallet = new EWallet();

wallet.setUser(user);
wallet.setBalance(BigDecimal.ZERO);
wallet.setLockedAmount(BigDecimal.ZERO);
wallet.setCurrency("VND");
eWalletRepository.save(wallet);

}

@Override
public PaymentTransactionResponse requestDeposit(DepositRequest request, String userId) {
// Tìm ví của chính người đang đăng nhập
EWallet wallet = eWalletRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.WALLET_NOT_FOUND));

// Tạo giao dịch ở trạng thái PENDING (Chờ duyệt)
// CHƯA CỘNG TIỀN VÀO VÍ
PaymentTransaction transaction = PaymentTransaction.builder()
.eWallet(wallet)
.amount(request.getAmount())
.type(PaymentType.DEPOSIT)
.status(PaymentStatus.PENDING) // Quan trọng: PENDING
.description("User request deposit") // Có thể thêm mã giao dịch ngân hàng vào đây
.build();

PaymentTransaction savedTransaction = transactionRepository.save(transaction);
return transactionMapper.toResponse(savedTransaction);
}

@Override
public PaymentTransactionResponse rejectDeposit(Long transactionId) {
PaymentTransaction transaction = transactionRepository.findById(transactionId)
.orElseThrow(() -> new RuntimeException("Transaction not found"));

if (transaction.getStatus() != PaymentStatus.PENDING) {
throw new RuntimeException("Transaction is not pending");
}

// Chỉ đổi trạng thái -> FAILED, không cộng tiền
transaction.setStatus(PaymentStatus.FAILED);
transaction.setDescription(transaction.getDescription() + " [REJECTED BY ADMIN]");

return transactionMapper.toResponse(transactionRepository.save(transaction));
}

}