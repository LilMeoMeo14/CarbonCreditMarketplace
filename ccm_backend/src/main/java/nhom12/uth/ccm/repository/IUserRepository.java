package nhom12.uth.ccm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import nhom12.uth.ccm.model.User;

public interface IUserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);
}
