package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CarbonSavingRequest {
    @NotNull(message = "DISTANCE_REQUIRED")
    private BigDecimal distanceKm; // Quãng đường đã đi (km)

    @NotNull(message = "DATE_REQUIRED")
    private LocalDate recordedDate; // Ngày ghi nhận
}
