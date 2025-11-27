package nhom12.uth.ccm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.CarbonCreditRequest;

@Repository
public interface ICarbonCreditRequestRepository extends JpaRepository<CarbonCreditRequest, Long> {

    // tim tat ca cac yeu cau phat tin chi cua 1 user
    List<CarbonCreditRequest> findByUser_UserId(String userId);
}
