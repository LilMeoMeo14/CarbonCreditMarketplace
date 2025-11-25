package nhom12.uth.ccm.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWebhookRequest {

    private String referenceNumber;  // Mã tham chiếu giao dịch
    private String status;           // COMPLETED, FAILED
    private BigDecimal amount;       // Số tiền
    private String signature;        // Chữ ký xác thực từ payment gateway
    private String message;          // Thông báo từ payment gateway
    private Long timestamp;          // Thời gian callback
}
