package nhom12.uth.ccm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import nhom12.uth.ccm.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}
