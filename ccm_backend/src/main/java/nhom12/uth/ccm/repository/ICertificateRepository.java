package nhom12.uth.ccm.repository;

import nhom12.uth.ccm.model.Certificate;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.CertificateType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICertificateRepository extends JpaRepository<Certificate, Integer> {

    /**
     * Lấy tất cả certificates của một user.
     * - Dùng cho endpoint: GET /my
     * - Khi user đăng nhập, truyền userId vào để lấy danh sách chứng chỉ họ sở hữu.
     */
    List<Certificate> findByUser_UserId(String userId);

    /**
     * Lấy tất cả certificates theo loại (ISSUED hoặc PURCHASED).
     * - Dùng cho service "get list" nếu muốn lọc theo loại chứng chỉ.
     * - Ví dụ: lấy tất cả chứng chỉ phát hành (ISSUED).
     */
    List<Certificate> findByCertificateType(CertificateType certificateType);

    /**
     * Lấy tất cả certificates của một user theo loại.
     * - Kết hợp cả user và loại chứng chỉ.
     * - Dùng cho trường hợp: user muốn xem riêng chứng chỉ đã mua hoặc đã phát hành.
     */
    List<Certificate> findByUserAndCertificateType(User user, CertificateType certificateType);

    /**
     * Tìm certificate theo số hiệu chứng chỉ (certificate_number).
     * - Dùng cho endpoint: GET /{certificateId} hoặc để kiểm tra trùng số hiệu.
     * - certificate_number là unique, nên có thể dùng để tìm nhanh.
     */
    Certificate findByCertificateNumber(String certificateNumber);
}
