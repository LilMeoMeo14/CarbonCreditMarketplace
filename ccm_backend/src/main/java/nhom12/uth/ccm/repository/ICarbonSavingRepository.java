package nhom12.uth.ccm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.CarbonSaving;
import nhom12.uth.ccm.model.EVProfile;

@Repository
public interface ICarbonSavingRepository extends JpaRepository<CarbonSaving, Long> {
    // tim tat ca cac ban ghi 1 evprofile
    List<CarbonSaving> findByEvProfile(EVProfile evProfile);
}
