package nhom12.uth.ccm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.EVProfile;

@Repository
public interface EVProfileRepository extends JpaRepository<EVProfile, Long> {
}
