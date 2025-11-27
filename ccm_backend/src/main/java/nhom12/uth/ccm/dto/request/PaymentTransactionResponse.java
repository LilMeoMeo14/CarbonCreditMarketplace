package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nhom12.uth.ccm.model.enums.PaymentStatus;
import nhom12.uth.ccm.model.enums.PaymentType;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransactionResponse {
    private Long transactionId;
    private Long walletId; // Ví nào được nạp
    private BigDecimal amount; // Số tiền
    private PaymentType type; // DEPOSIT
    private PaymentStatus status; // COMPLETED
    private String description;
    private LocalDateTime createdAt;
}