package nhom12.uth.ccm.repository;

import java.util.List;
import java.util.Optional;

import nhom12.uth.ccm.model.EVProfile;
import nhom12.uth.ccm.model.enums.RequestStatus;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.CarbonCreditRequest;

@Repository
public interface ICarbonCreditRequestRepository extends JpaRepository<CarbonCreditRequest, Long> {

    // tim tat ca cac yeu cau phat tin chi cua 1 user
    List<CarbonCreditRequest> findByUser_UserId(String userId);

    List<CarbonCreditRequest> findByStatus(RequestStatus status);
}
