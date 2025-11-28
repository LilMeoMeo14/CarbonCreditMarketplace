package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RetireRequest {

    // so luong tin chi muon quy doi
    BigDecimal amount;

    String reason; // ly do chuyen doi

}