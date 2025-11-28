package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.CertificateType;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CertificateResponse {
    Long certificateId;
    String ownerName;
    BigDecimal amount; // so luong
    String serialNumber;
    String reason; // ly do
    LocalDate issueDate;
    CertificateType type;// ISSUANCE hay RETIREMENT
}