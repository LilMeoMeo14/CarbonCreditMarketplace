package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class EvProfileRequest {

    // hang xe
    private String vehicleModel;

    // bien so xe
    private String licensePlate;

    // dung luong pin
    private BigDecimal batteryCapacityKwh;

    // ngay dang ky
    private LocalDate registrationDate;

    // tai lieu ve xe(link bang lai xe ,.....)
    private String verificationDocumentUrl;

}
