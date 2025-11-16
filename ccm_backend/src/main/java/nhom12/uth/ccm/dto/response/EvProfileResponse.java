package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.VerificationStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EvProfileResponse {

    // id evprofile
    Long evProfileId;

    // hang xe
    String vehicleModel;

    // bien so xe
    String licensePlate;

    // dung luong pin
    BigDecimal batteryCapacityKwh;

    // ngay dang ky
    LocalDate registrationDate;

    // trang thai duyet
    VerificationStatus verificationStatus;

    // tai ieu xe
    String verificationDocumentUrl;
}
