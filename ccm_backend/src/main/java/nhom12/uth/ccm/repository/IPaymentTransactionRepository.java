package nhom12.uth.ccm.repository;

import nhom12.uth.ccm.model.EWallet;
import nhom12.uth.ccm.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findByeWalletOrderByCreatedAtDesc(EWallet eWallet);

    Optional<PaymentTransaction> findByReferenceNumber(String referenceNumber);

    List<PaymentTransaction> findByeWalletWalletIdOrderByCreatedAtDesc(Long walletId);
}
