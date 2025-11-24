package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.RequestStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreditRequestResponse {
    Long requestId;
    Long evProfileId;
    String licensePlate;
    BigDecimal co2AmountKg;
    BigDecimal creditAmount;
    LocalDate requestDate;
    RequestStatus status; // status PENDING
    String verificationNote;
    LocalDateTime createdAt;
}
