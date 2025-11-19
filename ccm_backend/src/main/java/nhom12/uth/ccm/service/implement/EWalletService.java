package nhom12.uth.ccm.service.implement;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.DepositRequest;
import nhom12.uth.ccm.dto.request.WithdrawRequest;
import nhom12.uth.ccm.dto.response.BalanceResponse;
import nhom12.uth.ccm.dto.response.EWalletResponse;
import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.model.EWallet;
import nhom12.uth.ccm.model.PaymentTransaction;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.IEWalletRepository;
import nhom12.uth.ccm.repository.IPaymentTransactionRepository;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IEWalletService;
import nhom12.uth.ccm.service.IPaymentGatewayService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EWalletService implements IEWalletService {

    private final IEWalletRepository eWalletRepository;
    private final IUserRepository userRepository;
    private final IPaymentTransactionRepository paymentTransactionRepository;
    private final IPaymentGatewayService paymentGatewayService;

    @Override
    @Transactional(readOnly = true)
    public EWalletResponse getEWalletByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        EWallet wallet = eWalletRepository.findByUser(user)
                .orElseGet(() -> createWalletForUser(user));

        return mapToResponse(wallet);
    }

    @Override
    @Transactional(readOnly = true)
    public BalanceResponse getBalance(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        EWallet wallet = eWalletRepository.findByUser(user)
                .orElseGet(() -> createWalletForUser(user));

        return BalanceResponse.builder()
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentTransactionResponse> getHistory(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        EWallet wallet = eWalletRepository.findByUser(user)
                .orElseGet(() -> createWalletForUser(user));

        List<PaymentTransaction> transactions = paymentTransactionRepository
                .findByEWalletOrderByCreatedAtDesc(wallet);

        return transactions.stream()
                .map(this::mapTransactionToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> deposit(String userId, DepositRequest request) {
        // Validate amount
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_AMOUNT);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        EWallet wallet = eWalletRepository.findByUser(user)
                .orElseGet(() -> createWalletForUser(user));

        // Create PaymentTransaction with PENDING status
        PaymentTransaction transaction = PaymentTransaction.builder()
                .eWallet(wallet)
                .amount(request.getAmount())
                .transactionType(PaymentTransaction.TransactionType.DEPOSIT)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "BANK_TRANSFER")
                .status(PaymentTransaction.PaymentStatus.PENDING)
                .referenceNumber(generateReferenceNumber())
                .build();

        transaction = paymentTransactionRepository.save(transaction);

        // Get payment URL from mock payment gateway
        String paymentUrl = paymentGatewayService.createPaymentUrl(
                transaction.getReferenceNumber(),
                request.getAmount(),
                transaction.getPaymentMethod()
        );

        // Return payment URL and transaction info
        Map<String, Object> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        response.put("transaction", mapTransactionToResponse(transaction));
        response.put("message", "Please complete payment at the provided URL");

        return response;
    }

    @Override
    @Transactional
    public PaymentTransactionResponse withdraw(String userId, WithdrawRequest request) {
        // Validate amount
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_AMOUNT);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        EWallet wallet = eWalletRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.EWALLET_NOT_FOUND));

        // Check sufficient balance
        if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        // Update balance immediately
        wallet.withdraw(request.getAmount());
        eWalletRepository.save(wallet);

        // Create PaymentTransaction with COMPLETED status
        PaymentTransaction transaction = PaymentTransaction.builder()
                .eWallet(wallet)
                .amount(request.getAmount())
                .transactionType(PaymentTransaction.TransactionType.WITHDRAW)
                .paymentMethod("BANK_TRANSFER")
                .status(PaymentTransaction.PaymentStatus.COMPLETED)
                .referenceNumber(generateReferenceNumber())
                .build();

        transaction = paymentTransactionRepository.save(transaction);

        return mapTransactionToResponse(transaction);
    }

    @Override
    @Transactional
    public EWalletResponse createEWalletForUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if wallet already exists
        if (eWalletRepository.existsByUser(user)) {
            return getEWalletByUserId(userId);
        }

        EWallet wallet = createWalletForUser(user);
        return mapToResponse(wallet);
    }

    private EWallet createWalletForUser(User user) {
        EWallet wallet = new EWallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setCurrency("VND");
        return eWalletRepository.save(wallet);
    }

    private String generateReferenceNumber() {
        return "TXN" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }

    private EWalletResponse mapToResponse(EWallet wallet) {
        return EWalletResponse.builder()
                .walletId(wallet.getWalletId())
                .userId(wallet.getUser().getUserId())
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .createdAt(wallet.getCreatedAt())
                .updatedAt(wallet.getUpdatedAt())
                .build();
    }

    private PaymentTransactionResponse mapTransactionToResponse(PaymentTransaction transaction) {
        return PaymentTransactionResponse.builder()
                .paymentId(transaction.getPaymentId())
                .walletId(transaction.getEWallet().getWalletId())
                .amount(transaction.getAmount())
                .transactionType(transaction.getTransactionType().name())
                .paymentMethod(transaction.getPaymentMethod())
                .status(transaction.getStatus().name())
                .referenceNumber(transaction.getReferenceNumber())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
