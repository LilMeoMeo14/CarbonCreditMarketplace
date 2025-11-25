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

    // Số lượng đang bị khóa (đang nằm trong các Listing ACTIVE)
    @Column(name = "locked_amount", precision = 19, scale = 4, nullable = false)
    @ColumnDefault("0.0000")
    private BigDecimal lockedAmount = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // === Các phương thức logic tiện ích ===
    /** Lấy số dư khả dụng */
    public BigDecimal getAvailableBalance() {
        return this.balance.subtract(this.lockedAmount);
    }

    public void deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Amount must be positive");
        this.balance = this.balance.add(amount);
    }

 /** Khóa tín chỉ khi tạo Listing */
    public void lockCredits(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Amount must be positive");
        if (getAvailableBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient available balance to list this amount.");
        }
        this.lockedAmount = this.lockedAmount.add(amount);
    }

   /** Mở khóa tín chỉ khi hủy bán hoặc hết hạn */
    public void unlockCredits(BigDecimal amount) {
        if (this.lockedAmount.compareTo(amount) < 0)
            throw new IllegalArgumentException("Locked amount error");
        this.lockedAmount = this.lockedAmount.subtract(amount);
    }

    /** Trừ tiền thật khi giao dịch thành công - Trừ cả balance và locked */
    public void deductLockedCredits(BigDecimal amount) {
        if (this.balance.compareTo(amount) < 0 || this.lockedAmount.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Balance error during transaction");
        }
        this.balance = this.balance.subtract(amount);
        this.lockedAmount = this.lockedAmount.subtract(amount);
    }
}

