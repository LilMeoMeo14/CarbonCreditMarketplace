package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.CreditStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CarbonCreditResponse {
    Long creditId;
    BigDecimal amount;
    CreditStatus status;
    LocalDateTime issuedDate; // ngay cap
    LocalDateTime expiryDate; // ngay het han

    Long requestId;
    String ownerId; // chu so huu
    String ownerEmail;
}