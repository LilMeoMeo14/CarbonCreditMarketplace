package nhom12.uth.ccm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWebhookResponse {

    private boolean success;
    private String message;
    private String referenceNumber;
}
