package nhom12.uth.ccm.repository;

import nhom12.uth.ccm.model.EVProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEvProfileRepository extends JpaRepository<EVProfile, Long> {

    // Tim tat ca xe cua 1 user
    List<EVProfile> findByUser_UserId(String userId);

    // Tim 1 xe cu the 1 cua user nao do
    Optional<EVProfile> findByEvProfileIdAndUser_UserId(Long evProfileId, String userId);
}
