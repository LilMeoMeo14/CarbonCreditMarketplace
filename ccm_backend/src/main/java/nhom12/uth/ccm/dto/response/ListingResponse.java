package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.ListingStatus;
import nhom12.uth.ccm.model.enums.ListingType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ListingResponse {
    Long listingId;

    // seller information
    String sellerId;
    String sellerName; // firstname + lastname
    BigDecimal amount;
    BigDecimal price;
    ListingType listingType;
    ListingStatus status;
    LocalDateTime createdAt;
    LocalDateTime expiresAt;
}