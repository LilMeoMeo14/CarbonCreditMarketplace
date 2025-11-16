package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class EvProfileRequest {

    // hang xe
    String vehicleModel;

    // bien so xe
    String licensePlate;

    // dung luong pin
    BigDecimal batteryCapacityKwh;

    // ngay dang ky
    LocalDate registrationDate;

    // tai lieu ve xe(link bang lai xe ,.....)
    String verificationDocumentUrl;

}
