package nhom12.uth.ccm.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import nhom12.uth.ccm.document.ListingDocument;

public interface IListingSearchRepository extends ElasticsearchRepository<ListingDocument, Long> {

    // tim kiem theo model xe va trang thai active
    List<ListingDocument> findByVehicleModelContainingAndStatus(String vehicleModel, String status);
}
