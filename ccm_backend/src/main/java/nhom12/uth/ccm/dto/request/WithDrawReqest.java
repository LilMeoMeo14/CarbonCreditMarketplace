package nhom12.uth.ccm.dto.request;

import java.math.BigDecimal;

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
public class WithDrawReqest {
    BigDecimal amount; // Số tiền muốn rút
    String bankInfo; // thông tin ngân hàng , chưa đủ trình nên làm sạo sạo duyệt tay
}
