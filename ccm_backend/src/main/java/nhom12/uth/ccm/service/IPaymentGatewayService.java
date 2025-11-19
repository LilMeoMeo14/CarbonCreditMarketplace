package nhom12.uth.ccm.service;

import java.math.BigDecimal;

public interface IPaymentGatewayService {

    /**
     * Create payment URL for deposit transaction
     * This is a mock implementation
     * @param referenceNumber Transaction reference number
     * @param amount Payment amount
     * @param paymentMethod Payment method
     * @return Payment URL
     */
    String createPaymentUrl(String referenceNumber, BigDecimal amount, String paymentMethod);

    /**
     * Simulate payment completion (for testing)
     * @param referenceNumber Transaction reference number
     * @return Webhook callback data
     */
    String simulatePaymentCompletion(String referenceNumber);
}
