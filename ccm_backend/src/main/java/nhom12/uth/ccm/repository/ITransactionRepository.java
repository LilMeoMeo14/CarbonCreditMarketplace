package nhom12.uth.ccm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.CreditTransaction;

@Repository
public interface ITransactionRepository extends JpaRepository<CreditTransaction, Long> {

    // xem lich su mua hang
    List<CreditTransaction> findByBuyer_UserIdOrderByCreatedAtDesc(String userId);

    // xem lich su ban
    List<CreditTransaction> findBySeller_UserIdOrderByCreatedAtDesc(String userId);
}