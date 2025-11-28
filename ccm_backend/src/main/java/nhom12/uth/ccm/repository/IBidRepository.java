package nhom12.uth.ccm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nhom12.uth.ccm.model.Bid;
import nhom12.uth.ccm.model.Listing;

@Repository
public interface IBidRepository extends JpaRepository<Bid, Long> {

    // tim gia cao nhat cua phien dau gia hien tai
    Optional<Bid> findTopByListingOrderByAmountDesc(Listing listing);

}