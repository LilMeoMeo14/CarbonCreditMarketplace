package nhom12.uth.ccm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.EWallet;

@Repository
public interface IEWalletRepository extends JpaRepository<EWallet, Long> {

    // tim vi tien cua user

    Optional<EWallet> findByUser_UserId(String userId);

}