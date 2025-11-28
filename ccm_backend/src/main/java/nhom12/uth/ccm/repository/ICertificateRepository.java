package nhom12.uth.ccm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.Certificate;

@Repository
public interface ICertificateRepository extends JpaRepository<Certificate, Long> {
    /**
     * Tìm danh sách chứng nhận của một User cụ thể.
     * Sắp xếp theo ngày cấp (issuedAt) giảm dần (mới nhất lên đầu).
     * Dùng cho API: GET /certificates/my-certificates
     */
    List<Certificate> findByUser_UserIdOrderByIssueDateDesc(String userId);

    /**
     * Tìm chứng nhận theo Mã số (Serial Number).
     * Dùng cho tính năng Tra cứu/Xác thực chứng nhận công khai.
     */
    Optional<Certificate> findBySerialNumber(String serialNumber);
}