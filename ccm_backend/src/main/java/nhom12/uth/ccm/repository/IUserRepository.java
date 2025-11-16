package nhom12.uth.ccm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.User;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, String> {

    // kiem tra email ton tai chua
    boolean existsByEmail(String email);

    // kiem tra phone ton tai chua
    boolean existsByPhoneNumber(String phoneNumber);

    // tim user theo email
    Optional<User> findByEmail(String email);

    // tim user theo phone
    Optional<User> findByPhoneNumber(String phoneNumber);
}
