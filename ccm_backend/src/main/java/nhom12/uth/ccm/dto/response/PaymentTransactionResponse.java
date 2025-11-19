package nhom12.uth.ccm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransactionResponse {

    private Integer paymentId;
    private Long walletId;
    private BigDecimal amount;
    private String transactionType;  // DEPOSIT, WITHDRAW, PURCHASE, SALE_REVENUE
    private String paymentMethod;
    private String status;           // PENDING, COMPLETED, FAILED, REFUNDED
    private String referenceNumber;
    private LocalDateTime createdAt;
}
