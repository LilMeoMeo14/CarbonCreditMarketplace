package nhom12.uth.ccm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.CarbonCreditRequest;

@Repository
public interface CarbonCreditRequestRepository extends JpaRepository<CarbonCreditRequest, Long> {
}
