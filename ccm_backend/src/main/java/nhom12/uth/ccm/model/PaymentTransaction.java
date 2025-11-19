package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity: PaymentTransaction
 * Bảng lưu thông tin các giao dịch thanh toán.
 * Mỗi PaymentTransaction có thể liên kết với:
 *  - Một EWallet (ví người dùng)
 *  - Một Transaction (giao dịch mua/bán tín chỉ)
 */
@Entity
@Table(name = "payment_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    /**
     * Khóa chính (Primary Key)
     * INT AUTO_INCREMENT
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id", updatable = false, nullable = false)
    private Integer paymentId;



    /**
     * Quan hệ N-1 với EWallet
     * Một EWallet có thể có nhiều PaymentTransaction
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private EWallet eWallet;

    /**
     * Quan hệ N-1 với Transaction
     * Một Transaction có thể liên kết nhiều PaymentTransaction
     * Có thể null nếu giao dịch không liên quan tới tín chỉ
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    /**
     * Số tiền thanh toán (precision = 12, scale = 2)
     */
    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    /**
     * Loại giao dịch
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private TransactionType transactionType;

    /**
     * Phương thức thanh toán
     */
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    /**
     * Trạng thái giao dịch
     * Mặc định: PENDING
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    /**
     * Mã tham chiếu giao dịch bên thứ 3
     */
    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    /**
     * Thời gian tạo bản ghi
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ================== ENUMS ==================

    /**
     * Loại giao dịch của PaymentTransaction
     */

    public enum TransactionType {
        DEPOSIT,        // Nạp tiền
        WITHDRAW,       // Rút tiền
        PURCHASE,       // Mua tín chỉ carbon
        SALE_REVENUE    // Doanh thu bán tín chỉ
    }

     public enum PaymentStatus {
        PENDING, COMPLETED, FAILED
    }

  
}
