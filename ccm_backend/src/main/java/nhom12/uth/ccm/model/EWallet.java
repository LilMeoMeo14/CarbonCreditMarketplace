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

    // Mỗi user có 1 ví điện tử riêng biệt
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true, columnDefinition = "VARCHAR(36)")
    private User user;

    // Số dư hiện tại của ví (tiền)
    @Column(name = "balance", precision = 19, scale = 4, nullable = false)
    @ColumnDefault("0.0000")
    private BigDecimal balance = BigDecimal.ZERO;

    // Đơn vị tiền tệ (VND, USD, v.v.)
    @Column(name = "currency", length = 10, nullable = false)
    @ColumnDefault("'VND'")
    private String currency = "VND";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    // === Các phương thức logic tiện ích ===

    /** Nạp tiền vào ví */
    public void deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive."); //Số tiền nạp phải lớn hơn 0
        }
        this.balance = this.balance.add(amount);
    }

    /** Rút tiền khỏi ví */
    public void withdraw(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdraw amount must be positive."); //Số tiền rút phải lớn hơn 0
        }
        if (this.balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance."); //Số dư không đủ để thực hiện giao dịch
        }
        this.balance = this.balance.subtract(amount);
    }
}
