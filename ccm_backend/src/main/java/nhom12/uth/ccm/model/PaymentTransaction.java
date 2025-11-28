package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.*;
import nhom12.uth.ccm.model.enums.PaymentStatus;
import nhom12.uth.ccm.model.enums.PaymentType;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity: PaymentTransaction
 * Bảng lưu thông tin các giao dịch thanh toán.
 * Mỗi PaymentTransaction có thể liên kết với:
 * - Một EWallet (ví người dùng)
 * - Một Transaction (giao dịch mua/bán tín chỉ)
 */
@Entity
@Table(name = "payment_transaction")
@Getter // Thêm
@Setter // Thêm
@NoArgsConstructor
@AllArgsConstructor // Thêm
@Builder // Thêm Builder để code Service cho gọn
public class PaymentTransaction {

    /**
     * Khóa chính (Primary Key)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id", updatable = false, nullable = false)
    private Long paymentId; // SỬA: Integer -> Long

    /**
     * Quan hệ N-1 với EWallet
     * Giao dịch này thuộc về ví nào?
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private EWallet eWallet;

    /**
     * Quan hệ N-1 với Transaction (Giao dịch Mua/Bán tín chỉ)
     * Có thể null (VD: Nạp tiền thì không liên quan đến mua bán)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private CreditTransaction transaction; // Bạn cần đảm bảo model 'Transaction' đã tồn tại hoặc tạo sau

    /**
     * Số tiền thanh toán
     */
    @Column(name = "amount", nullable = false, precision = 19, scale = 2) // SỬA: precision 12 -> 19 cho an toàn
    private BigDecimal amount;

    /**
     * Loại giao dịch (Nạp, Rút, Mua, Bán...)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private PaymentType type; // SỬA: TransactionType -> PaymentType

    /**
     * Phương thức thanh toán (VNPay, Bank Transfer...)
     */
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    /**
     * Trạng thái giao dịch
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default // Thêm default cho Builder
    private PaymentStatus status = PaymentStatus.PENDING;

    /**
     * Mã tham chiếu giao dịch bên thứ 3 (Mã VNPay...)
     */
    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    /**
     * Mô tả giao dịch
     */
    @Column(name = "description")
    private String description;

    /**
     * Thời gian tạo bản ghi
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}