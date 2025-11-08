package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_wallet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarbonWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallet_id", updatable = false, nullable = false)
    private Long walletId;

    // Mỗi user chỉ có 1 ví carbon
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true, columnDefinition = "VARCHAR(36)")
    private User user;

    // Tổng số dư carbon credit của user
    @Column(name = "balance", precision = 19, scale = 4, nullable = false)
    @ColumnDefault("0.0000")
    private BigDecimal balance = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // === Các phương thức logic tiện ích ===

    /** Nạp thêm tín chỉ carbon vào ví */
    public void deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive.");
        }
        this.balance = this.balance.add(amount);
    }

    /** Trừ tín chỉ carbon (khi bán, chuyển nhượng, hoặc dùng) */
    public void withdraw(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdraw amount must be positive.");
        }
        if (this.balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance.");
        }
        this.balance = this.balance.subtract(amount);
    }
}
