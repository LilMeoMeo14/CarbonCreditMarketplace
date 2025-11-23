package nhom12.uth.ccm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.CarbonSaving;
import nhom12.uth.ccm.model.EVProfile;
import nhom12.uth.ccm.model.enums.VerificationStatus;

@Repository
public interface ICarbonSavingRepository extends JpaRepository<CarbonSaving, Long> {
    // tim tat ca cac ban ghi 1 evprofile
    List<CarbonSaving> findByEvProfile(EVProfile evProfile);

    // tim cac ban ghi tiet kiem cua xe nay , da duoc duyet va khong nam trong
    // request nao

    List<CarbonSaving> findByEvProfileAndStatusAndCarbonCreditRequestIsNull(
            EVProfile evProfile, VerificationStatus verificationStatus);

}
