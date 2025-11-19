package nhom12.uth.ccm.repository;

import nhom12.uth.ccm.model.EWallet;
import nhom12.uth.ccm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IEWalletRepository extends JpaRepository<EWallet, Long> {

    /**
     * Tìm ví điện tử theo user
     * @param user User entity
     * @return Optional<EWallet>
     */
    Optional<EWallet> findByUser(User user);

    /**
     * Tìm ví điện tử theo userId
     * @param userId User ID
     * @return Optional<EWallet>
     */
    Optional<EWallet> findByUser_UserId(String userId);

    /**
     * Kiểm tra user đã có ví điện tử chưa
     * @param user User entity
     * @return boolean
     */
    boolean existsByUser(User user);
}
