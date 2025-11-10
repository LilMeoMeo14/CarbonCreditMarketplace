package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.*;

import nhom12.uth.ccm.model.enums.CertificateType;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity: Certificate
 * Bảng quản lý TẬP TRUNG tất cả chứng chỉ carbon.
 * Mỗi chứng chỉ có thể được phát hành khi:
 *  - User tạo tín chỉ carbon (ISSUED)
 *  - User mua tín chỉ carbon (PURCHASED)
 */
@Entity
@Table(name = "certificate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    /**
     * Khóa chính (Primary Key(PK)
     * Tự tăng (AUTO_INCREMENT)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id", updatable = false, nullable = false)
    private Integer certificate_id;

    /**
     * Quan hệ N-1 với User
     * Một User có thể sở hữu nhiều Certificate. Nhưng mỗi Certificate chỉ thuộc về một User.
     * - user_id: FK → USER.user_id
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Loại chứng chỉ:
     * - CARBON_CREDIT_ISSUED: Phát hành tín chỉ carbon (khi tạo mới)
     * - CARBON_CREDIT_PURCHASED: Mua tín chỉ carbon (qua giao dịch)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_type", nullable = false, length = 50)
    private CertificateType certificate_type;

    /**
     * ID liên quan: có thể là credit_id hoặc transaction_id
     * Giúp truy xuất ngược lại nguồn gốc chứng chỉ.
     */
    @Column(name = "related_id", nullable = false)
    private Integer related_id;

    /**
     * Lượng CO₂ tương ứng của chứng chỉ (đơn vị: kg)
     */
    @Column(name = "co2_amount_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal co2_amount_kg;

    /**
     * Ngày phát hành chứng chỉ
     */
    @Column(name = "issue_date", nullable = false)
    private LocalDate issue_date;

    /**
     * Số hiệu chứng chỉ (mã duy nhất)
     * Ví dụ: CERT-2025-0001
     */
    @Column(name = "certificate_number", unique = true, length = 100)
    private String certificate_number;

    /**
     * Đường dẫn (URL) đến file PDF chứng chỉ
     * Có thể trỏ đến AWS S3, Firebase Storage hoặc local server
     */
    @Column(name = "pdf_url", length = 255)
    private String pdf_url;

    /**
     * Thời gian tạo bản ghi (tự động thêm khi insert)
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime created_at;
}
