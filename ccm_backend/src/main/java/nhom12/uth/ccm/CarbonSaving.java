package nhom12.uth.ccm;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Đại diện cho bản ghi lượng carbon tiết kiệm được từ việc sử dụng xe điện
public class CarbonSaving {

    private Long savingId; // Khóa chính 
    private EVProfile evProfile; // Mối quan hệ Many-to-One với EVProfile
    private BigDecimal distanceKm; // Khoảng cách đã đi 
    private BigDecimal co2SavedKg; // Lượng CO2 tiết kiệm được 
    private String calculationMethod; // Phương pháp tính toán
    private LocalDate recordedDate; // Ngày ghi nhận
    private LocalDateTime createdAt; // Thời gian tạo bản ghi

    // Hàm khởi tạo mặc định
    public CarbonSaving() {
    }

    // Hàm khởi tạo đầy đủ
    public CarbonSaving(EVProfile evProfile, BigDecimal distanceKm, BigDecimal co2SavedKg, String calculationMethod, LocalDate recordedDate) {
        this.evProfile = evProfile;
        this.distanceKm = distanceKm;
        this.co2SavedKg = co2SavedKg;
        this.calculationMethod = calculationMethod;
        this.recordedDate = recordedDate;
    }

    // Getters
    public Long getSavingId() {
        return savingId;
    }

    public EVProfile getEvProfile() {
        return evProfile;
    }

    public BigDecimal getDistanceKm() {
        return distanceKm;
    }

    public BigDecimal getCo2SavedKg() {
        return co2SavedKg;
    }

    public String getCalculationMethod() {
        return calculationMethod;
    }

    public LocalDate getRecordedDate() {
        return recordedDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setSavingId(Long savingId) {
        this.savingId = savingId;
    }

    public void setEvProfile(EVProfile evProfile) {
        this.evProfile = evProfile;
    }

    public void setDistanceKm(BigDecimal distanceKm) {
        this.distanceKm = distanceKm;
    }

    public void setCo2SavedKg(BigDecimal co2SavedKg) {
        this.co2SavedKg = co2SavedKg;
    }

    public void setCalculationMethod(String calculationMethod) {
        this.calculationMethod = calculationMethod;
    }

    public void setRecordedDate(LocalDate recordedDate) {
        this.recordedDate = recordedDate;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}