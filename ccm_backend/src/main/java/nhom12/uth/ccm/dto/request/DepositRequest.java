package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DepositRequest {
    private String userId;
    @NotNull(message = "AMOUNT_REQUIRED")
    @Positive(message = "AMOUNT_MUST_BE_POSITIVE")
    private BigDecimal amount; // Số tiền muốn cộng

}
