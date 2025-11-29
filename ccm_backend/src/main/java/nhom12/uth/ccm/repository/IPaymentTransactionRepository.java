package nhom12.uth.ccm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.PaymentTransaction;
import nhom12.uth.ccm.model.enums.PaymentStatus;

@Repository
public interface IPaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    // lay giao dich theo trang thai
    List<PaymentTransaction> findByStatus(PaymentStatus status);

}
