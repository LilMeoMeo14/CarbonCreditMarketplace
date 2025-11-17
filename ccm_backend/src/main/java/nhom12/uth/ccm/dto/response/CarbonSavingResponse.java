package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarbonSavingResponse {
    private Long savingId;
    private BigDecimal distanceKm;
    private BigDecimal co2SavedKg; // (Server đã tính)
    private String calculationMethod; // (Server đã gán)
    private LocalDate recordedDate;
    private LocalDateTime createdAt; // (Thời gian tạo)
}
