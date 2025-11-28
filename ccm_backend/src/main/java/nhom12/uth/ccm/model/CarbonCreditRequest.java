package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.*;
import nhom12.uth.ccm.model.enums.RequestStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ev_profile_id", nullable = false)
    private EVProfile evProfile;

    @Column(name = "co2_amount_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal co2AmountKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verifier_id", columnDefinition = "VARCHAR(36)")
    private User verifier;

    @Column(name = "verification_note", columnDefinition = "TEXT")
    private String verificationNote;

    @Column(name = "verified_date")
    private LocalDate verifiedDate;

    @Column(name = "credit_amount", precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal creditAmount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "carbonCreditRequest", fetch = FetchType.LAZY)
    @Builder.Default
    private List<CarbonSaving> carbonSavings = new ArrayList<>();

    @OneToOne(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private CarbonCredit carbonCredit;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    private void onCreate() {
        this.requestDate = LocalDate.now();
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