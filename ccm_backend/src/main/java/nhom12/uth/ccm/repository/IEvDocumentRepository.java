package nhom12.uth.ccm.repository;

import nhom12.uth.ccm.model.EvDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEvDocumentRepository extends JpaRepository<EvDocument, Long> {
}