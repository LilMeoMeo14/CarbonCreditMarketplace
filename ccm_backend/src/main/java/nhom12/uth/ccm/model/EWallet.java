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
@Table(name = "e_wallet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EWallet {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "wallet_id", updatable = false, nullable = false)
private Long walletId;

@OneToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false, unique = true, columnDefinition = "VARCHAR(36)")
private User user;

    // so du kha dung
    @Column(name = "balance", precision = 19, scale = 2, nullable = false)
    @ColumnDefault("0.00")
private BigDecimal balance = BigDecimal.ZERO;

   // Số tiền ĐANG BỊ KHÓA (Đang đặt cọc trong các phiên đấu giá)
    @Column(name = "locked_amount", precision = 19, scale = 2, nullable = false)
    @ColumnDefault("0.00")
    private BigDecimal lockedAmount = BigDecimal.ZERO;

@Column(name = "currency", length = 10, nullable = false)
@ColumnDefault("'VND'")
private String currency = "VND";
@@ -48,25 +50,58 @@
@Column(name = "updated_at", nullable = false)
private LocalDateTime updatedAt;


  



/* Nạp tiền */
    public void deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Deposit amount must be positive.");
this.balance = this.balance.add(amount);
}

    /* Rút tiền/Mua hàng (Trừ thẳng vào số dư khả dụng) */
public void withdraw(BigDecimal amount) {
         validateAmount(amount);
        if (this.balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance.");
}
        this.balance = this.balance.subtract(amount);
    }

    /* Khóa tiền (Khi User Đặt cọc/Bid) */
    public void lockMoney(BigDecimal amount) {
        validateAmount(amount);
if (this.balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance to lock (Not enough money to bid).");
}
        // Trừ ở ví chính -> Chuyển sang ví khóa
this.balance = this.balance.subtract(amount);
         this.lockedAmount = this.lockedAmount.add(amount);
    }

    /* Mở khóa tiền (Hoàn tiền cọc khi có người khác trả giá cao hơn) */
    public void unlockMoney(BigDecimal amount) {
        validateAmount(amount);
        if (this.lockedAmount.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Locked amount error (System error).");
        }
        // Trừ ở ví khóa -> Trả về ví chính
        this.lockedAmount = this.lockedAmount.subtract(amount);
        this.balance = this.balance.add(amount);
    }

    /* Trừ tiền khóa (Khi User Thắng đấu giá -> Tiền mất luôn) */
    public void deductLockedMoney(BigDecimal amount) {
        validateAmount(amount);
        if (this.lockedAmount.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Locked amount error (System error).");
        }
        // Tiền biến mất khỏi ví khóa (để chuyển sang ví người bán ở Service)
        this.lockedAmount = this.lockedAmount.subtract(amount);
    }

    // Helper validate
    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive.");
        }
}
}