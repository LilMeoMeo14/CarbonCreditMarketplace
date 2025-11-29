package nhom12.uth.ccm.service;

import java.math.BigDecimal;
import java.util.List;

import nhom12.uth.ccm.dto.response.CreditTransactionResponse;

public interface ITransactionService {
    /**
     * Thực hiện giao dịch "Mua Ngay" (Direct Purchase).
     */
    CreditTransactionResponse buyNow(Long listingId, BigDecimal amountToBuy, String buyerId);

    // xem lich su da mua gi
    List<CreditTransactionResponse> getMyPurchaseHistory(String userId);

    // xem lich su da ban gi
    List<CreditTransactionResponse> getMySalesHistory(String userId);

}
