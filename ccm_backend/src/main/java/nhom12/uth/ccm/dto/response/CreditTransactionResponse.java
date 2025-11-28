package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nhom12.uth.ccm.model.enums.TransactionType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditTransactionResponse {
    private Long transactionId;

    private Long listingId;

    private String sellerId;
    private String sellerName;

    private String buyerId;
    private String buyerName;

    private BigDecimal amount;
    private BigDecimal pricePerCredit;
    private BigDecimal totalMoney;

    private TransactionType type;
    private LocalDateTime createdAt;
}