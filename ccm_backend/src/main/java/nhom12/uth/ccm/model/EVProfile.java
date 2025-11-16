package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nhom12.uth.ccm.model.enums.VerificationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ev_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EVProfile {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "ev_profile_id")
        private Long evProfileId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", referencedColumnName = "user_id")
        private User user;
        @Column(name = "vehicle_model")
        private String vehicleModel;
        @Column(name = "license_plate", unique = true, nullable = false)
        private String licensePlate;
        @Column(name = "battery_capacity_kwh", precision = 10, scale = 2)
        private BigDecimal batteryCapacityKwh;
        @Column(name = "registration_date")
        private LocalDate registrationDate;
        @Enumerated(EnumType.STRING)
        @Column(name = "verification_status")
        private VerificationStatus verificationStatus;
        @Column(name = "verification_document_url")
        private String verificationDocumentUrl;
        @OneToMany(mappedBy = "evProfile", // "evProfile" là tên trường EVProfile bên class CarbonSaving
                        cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<CarbonSaving> carbonSavings = new ArrayList<>();
        @OneToMany(mappedBy = "evProfile", // "evProfile" là tên trường EVProfile bên class CarbonCreditRequest
                        cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<CarbonCreditRequest> creditRequests = new ArrayList<>();
}
