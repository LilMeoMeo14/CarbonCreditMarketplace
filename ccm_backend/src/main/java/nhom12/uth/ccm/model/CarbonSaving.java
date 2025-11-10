package nhom12.uth.ccm.model; 

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_saving")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CarbonSaving {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "saving_id", updatable = false, nullable = false)
    private Long savingId; 

    // Mối quan hệ Many-to-One với EVProfile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ev_profile_id", nullable = false) 
    private EVProfile evProfile; 

    @Column(name = "distance_km", precision = 10, scale = 2, nullable = false)
    private BigDecimal distanceKm; 

    @Column(name = "co2_saved_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal co2SavedKg; 

    @Column(name = "calculation_method", length = 50)
    private String calculationMethod; 

    @Column(name = "recorded_date", nullable = false)
    private LocalDate recordedDate; 

    @CreationTimestamp // Tự động điền thời gian tạo
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt; 

    /**
     * Constructor tạo CarbonSaving mới (không bao gồm ID và createdAt).
     * ID và createdAt sẽ được database tự động tạo.
     */
    public CarbonSaving(EVProfile evProfile, BigDecimal distanceKm, BigDecimal co2SavedKg, String calculationMethod, LocalDate recordedDate) {
        this.evProfile = evProfile;
        this.distanceKm = distanceKm;
        this.co2SavedKg = co2SavedKg;
        this.calculationMethod = calculationMethod;
        this.recordedDate = recordedDate;
    }
}
