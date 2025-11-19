package nhom12.uth.ccm.service.implement;

import lombok.extern.slf4j.Slf4j;
import nhom12.uth.ccm.service.IPaymentGatewayService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Mock Payment Gateway Service
 * In production, this would integrate with real payment gateways like:
 * - VNPay
 * - MoMo
 * - ZaloPay
 * - Stripe
 * - PayPal
 */
@Service
@Slf4j
public class PaymentGatewayService implements IPaymentGatewayService {

    private static final String MOCK_PAYMENT_BASE_URL = "https://mock-payment-gateway.ccm.com/pay";

    @Override
    public String createPaymentUrl(String referenceNumber, BigDecimal amount, String paymentMethod) {
        log.info("Creating payment URL for reference: {}, amount: {}, method: {}", 
                referenceNumber, amount, paymentMethod);

        // Mock payment URL
        // In production, this would call the actual payment gateway API
        String paymentUrl = String.format(
                "%s?ref=%s&amount=%s&method=%s&return_url=%s",
                MOCK_PAYMENT_BASE_URL,
                referenceNumber,
                amount.toString(),
                paymentMethod,
                "http://localhost:8080/api/payment/callback"
        );

        log.info("Generated payment URL: {}", paymentUrl);
        return paymentUrl;
    }

    @Override
    public String simulatePaymentCompletion(String referenceNumber) {
        log.info("Simulating payment completion for reference: {}", referenceNumber);
        
        // This method can be used for testing
        // It would trigger a webhook callback to our system
        return "Payment simulation initiated for: " + referenceNumber;
    }
}
