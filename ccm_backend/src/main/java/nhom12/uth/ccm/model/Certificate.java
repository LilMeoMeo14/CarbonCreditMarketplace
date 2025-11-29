package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.*;

import nhom12.uth.ccm.model.enums.CertificateType;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity: Certificate
 * Bảng quản lý TẬP TRUNG tất cả chứng chỉ carbon.
 * Mỗi chứng chỉ có thể được phát hành khi:
 * - User tạo tín chỉ carbon (ISSUED)
 * - User mua tín chỉ carbon (PURCHASED)
 */
@Entity
@Table(name = "certificate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id", updatable = false, nullable = false)
    private Long certificateId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_type", nullable = false, length = 50)
    private CertificateType type;

    @Column(name = "related_id")
    private Long relatedId;

    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "serial_number", unique = true, length = 100)
    private String serialNumber;

    @Column(name = "reason")
    private String reason;

    @Column(name = "pdf_url", length = 255)
    private String pdfUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Helper sinh mã Serial
    public static String generateSerialNumber() {
        return "CERT-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
