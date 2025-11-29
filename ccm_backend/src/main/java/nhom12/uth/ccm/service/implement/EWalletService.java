package nhom12.uth.ccm.service.implement;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.request.WithDrawReqest;
import nhom12.uth.ccm.dto.response.EWalletResponse;
import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.EWalletMapper;
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
    private final EWalletMapper eWalletMapper;

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

    @Override
    public EWalletResponse getMyWallet(String userId) {
        EWallet eWallet = eWalletRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.WALLET_NOT_FOUND));
        return eWalletMapper.toResponse(eWallet);
    }

    @Override
    public PaymentTransactionResponse requestWithDraw(WithDrawReqest withDrawReqest, String userId) {
        EWallet wallet = eWalletRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.WALLET_NOT_FOUND));

        // 2. TRỪ TIỀN NGAY LẬP TỨC (Để tránh double spending)
        // Hàm withdraw trong Model đã tự check số dư < amount -> throw exception
        try {
            wallet.withdraw(withDrawReqest.getAmount());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }
        eWalletRepository.save(wallet);

        // 3. Tạo Transaction PENDING
        PaymentTransaction transaction = PaymentTransaction.builder()
                .eWallet(wallet)
                .amount(withDrawReqest.getAmount())
                .type(PaymentType.WITHDRAW)
                .status(PaymentStatus.PENDING)
                .description("Withdraw request to: " + withDrawReqest.getBankInfo())
                .build();

        return transactionMapper.toResponse(transactionRepository.save(transaction));
    }

    @Override
    public PaymentTransactionResponse approveWithDraw(Long transactionId) {
        PaymentTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

        if (transaction.getStatus() != PaymentStatus.PENDING)
            throw new AppException(ErrorCode.STATUS_NOT_PENDING);
        if (transaction.getType() != PaymentType.WITHDRAW)
            throw new AppException(ErrorCode.STATUS_NOT_WITHDRAW);

        transaction.setStatus(PaymentStatus.COMPLETED);
        transaction.setDescription(transaction.getDescription() + " [APPROVED]");

        return transactionMapper.toResponse(transactionRepository.save(transaction));
    }

    @Override
    public PaymentTransactionResponse rejectWithDraw(Long transactionId, String reason) {
        PaymentTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

        if (transaction.getStatus() != PaymentStatus.PENDING)
            throw new AppException(ErrorCode.STATUS_NOT_PENDING);
        if (transaction.getType() != PaymentType.WITHDRAW)
            throw new AppException(ErrorCode.STATUS_NOT_WITHDRAW);

        // HOÀN TIỀN LẠI CHO USER
        EWallet wallet = transaction.getEWallet();
        wallet.deposit(transaction.getAmount());
        eWalletRepository.save(wallet);

        // Cập nhật trạng thái FAILED
        transaction.setStatus(PaymentStatus.FAILED);
        transaction.setDescription(transaction.getDescription() + " [REJECTED: " + reason + "]");

        return transactionMapper.toResponse(transactionRepository.save(transaction));
    }

    @Override
    public List<PaymentTransactionResponse> getPendingTransactions() {
        return transactionRepository.findByStatus(PaymentStatus.PENDING)
                .stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

}
