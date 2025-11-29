package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.ListingType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ListingRequest {

    @NotNull(message = "AMOUNT_REQUIRED")
    @Positive(message = "AMOUNT_MUST_BE_POSITIVE")
    BigDecimal amount; // Số lượng tín chỉ muốn bán

    @NotNull(message = "PRICE_REQUIRED")
    @Positive(message = "PRICE_MUST_BE_POSITIVE") // anotation không cho giá trị âm
    BigDecimal price; // Giá bán (hoặc giá khởi điểm)

    @NotNull(message = "LISTING_TYPE_REQUIRED")
    ListingType listingType; // DIRECT_SALE hoặc AUCTION

    // Chỉ bắt buộc nếu là AUCTION (Đấu giá)
    @Future(message = "EXPIRATION_DATE_MUST_BE_IN_FUTURE") // anotation này đảm bảo là ngày phải ở tương lai
    LocalDateTime expiresAt;
}
