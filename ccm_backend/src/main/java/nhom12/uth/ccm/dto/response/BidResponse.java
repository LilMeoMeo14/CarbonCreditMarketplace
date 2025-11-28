package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.BidStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BidResponse {
    Long bidId;
    Long listingId;
    String bidderId;
    String bidderName; // first + last
    BigDecimal amount;
    BidStatus status;
    LocalDateTime bidTime;
}