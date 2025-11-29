package nhom12.uth.ccm.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EWalletResponse {
    Long walletId;
    BigDecimal balance; // tien trong iv
    BigDecimal lockedAmount; // tien dang dat coc de dau gia
    String currency;
    LocalDateTime updatedAt;
}
