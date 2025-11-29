package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nhom12.uth.ccm.model.enums.VerificationStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarbonSavingResponse {
    private Long savingId;

    private Long evProfileId;
    private String licensePlate;
    private String vehicleModel;

    private BigDecimal distanceKm;
    private BigDecimal co2SavedKg;
    private String calculationMethod;
    private LocalDate recordedDate;
    private String evidenceImageUrl;

    private VerificationStatus status;
    private LocalDateTime createdAt;

}
