package nhom12.uth.ccm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.CarbonWallet;

@Repository
public interface ICarbonWalletRepository extends JpaRepository<CarbonWallet, Long> {
    // tim vi carbon cua 1 user

    Optional<CarbonWallet> findByUser_UserId(String userId);
}
