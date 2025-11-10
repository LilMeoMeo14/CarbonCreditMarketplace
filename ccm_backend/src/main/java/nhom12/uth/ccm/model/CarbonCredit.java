package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_credit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarbonCredit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "credit_id", updatable = false, nullable = false)
    private Long creditId;

    @Column(name = "amount", precision = 19, scale = 4, nullable = false)
    private BigDecimal amount; // Số lượng tín chỉ carbon được cấp

    @CreationTimestamp
    @Column(name = "issued_date", nullable = false, updatable = false)
    private LocalDateTime issuedDate; // Ngày phát hành

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate; // Ngày hết hạn (nếu có)

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE | EXPIRED | TRANSFERRED, ...

    // Mối quan hệ One-to-One (CarbonCreditRequest là bên mappedBy)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private CarbonCreditRequest request;

    // Mối quan hệ Many-to-One: người sở hữu tín chỉ carbon
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private User user;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructor tiện dụng
    public CarbonCredit(BigDecimal amount, CarbonCreditRequest request, User user) {
        this.amount = amount;
        this.request = request;
        this.user = user;
        this.status = "ACTIVE";
    }

    // Hàm logic quản lý trạng thái
    public void expire() {
        this.status = "EXPIRED";
    }

    public void transferTo(User newOwner) {
        this.user = newOwner;
        this.status = "TRANSFERRED";
    }
}