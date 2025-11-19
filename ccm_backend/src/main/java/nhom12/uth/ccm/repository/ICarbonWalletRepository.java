package nhom12.uth.ccm.repository;

import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICarbonWalletRepository extends JpaRepository<CarbonWallet, Long> {

    /**
     * Tìm ví carbon theo user
     * @param user User entity
     * @return Optional<CarbonWallet>
     */
    Optional<CarbonWallet> findByUser(User user);

    /**
     * Tìm ví carbon theo userId
     * @param userId User ID
     * @return Optional<CarbonWallet>
     */
    Optional<CarbonWallet> findByUser_UserId(String userId);

    /**
     * Kiểm tra user đã có ví carbon chưa
     * @param user User entity
     * @return boolean
     */
    boolean existsByUser(User user);
}
