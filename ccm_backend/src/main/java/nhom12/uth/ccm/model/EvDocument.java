package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.*;
import nhom12.uth.ccm.model.enums.EvDocumentType;

import java.time.LocalDateTime;

@Entity
@Table(name = "ev_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileUrl;

    @Enumerated(EnumType.STRING)
    private EvDocumentType type;

    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ev_profile_id")
    private EVProfile evProfile;
}
