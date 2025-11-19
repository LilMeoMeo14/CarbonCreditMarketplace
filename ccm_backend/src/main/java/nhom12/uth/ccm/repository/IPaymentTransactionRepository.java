package nhom12.uth.ccm.repository;

import nhom12.uth.ccm.model.EWallet;
import nhom12.uth.ccm.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPaymentTransactionRepository extends JpaRepository<PaymentTransaction, Integer> {

    /**
     * Tìm tất cả giao dịch thanh toán của một ví
     * @param eWallet EWallet entity
     * @return List<PaymentTransaction>
     */
    List<PaymentTransaction> findByEWalletOrderByCreatedAtDesc(EWallet eWallet);

    /**
     * Tìm giao dịch thanh toán theo reference number
     * @param referenceNumber Mã tham chiếu từ payment gateway
     * @return Optional<PaymentTransaction>
     */
    Optional<PaymentTransaction> findByReferenceNumber(String referenceNumber);

    /**
     * Tìm tất cả giao dịch theo wallet ID
     * @param walletId Wallet ID
     * @return List<PaymentTransaction>
     */
    List<PaymentTransaction> findByEWallet_WalletIdOrderByCreatedAtDesc(Long walletId);
}
