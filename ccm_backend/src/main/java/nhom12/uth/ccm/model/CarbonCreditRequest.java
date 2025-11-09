package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.*;
import nhom12.uth.ccm.model.enums.RequestStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp; 

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_credit_request")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarbonCreditRequest {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "request_id", updatable = false, nullable = false)
    private Long requestId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private User user; 

    // Mối quan hệ Many-to-One: Hồ sơ EV liên quan
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ev_profile_id", nullable = false)
    private EVProfile evProfile; 

    @Column(name = "co2_amount_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal co2AmountKg; 

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate = LocalDate.now(); 

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default// Ánh xạ giá trị DEFAULT từ ERD
    private RequestStatus status = RequestStatus.PENDING; // ENUM, DEFAULT 'PENDING'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verifier_id", columnDefinition = "VARCHAR(36)") // Ánh xạ tới User ID (UUID)
    private User verifier; 

    @Column(name = "verification_note", columnDefinition = "TEXT")
    private String verificationNote; 

    @Column(name = "verified_date")
    private LocalDate verifiedDate; 

    // Mối quan hệ One-to-One: Tín chỉ carbon được phát hành (nếu APPROVED)
    @OneToOne(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private CarbonCredit carbonCredit; 
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt; 

    @UpdateTimestamp // Thêm trường cập nhật theo ERD
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; 

    public CarbonCreditRequest(User user, EVProfile evProfile, BigDecimal co2AmountKg) {
        this.user = user;
        this.evProfile = evProfile;
        this.co2AmountKg = co2AmountKg;
        this.requestDate = LocalDate.now();
        this.status = RequestStatus.PENDING;
    }
    
    public void approve(User verifier, String note) {
        if (this.status != RequestStatus.PENDING) {
            throw new IllegalStateException("Request is not in PENDING status.");
        }
        this.status = RequestStatus.APPROVED;
        this.verifier = verifier;
        this.verificationNote = note;
        this.verifiedDate = LocalDate.now();
    }

    public void reject(User verifier, String reason) {
        if (this.status != RequestStatus.PENDING) {
            throw new IllegalStateException("Request is not in PENDING status.");
        }
        this.status = RequestStatus.REJECTED;
        this.verifier = verifier;
        this.verificationNote = reason;
        this.verifiedDate = LocalDate.now();
    }
}