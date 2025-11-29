package nhom12.uth.ccm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import nhom12.uth.ccm.model.CarbonCredit;

public interface ICarbonCreditRepository extends JpaRepository<CarbonCredit, Long> {

    // tim tat ca tin chi cua user
    List<CarbonCredit> findByUser_UserId(String userId);

    // tim tat ca cac tin chi da duyet theo cva id
    List<CarbonCredit> findByRequest_Verifier_UserId(String cvaId);

}
