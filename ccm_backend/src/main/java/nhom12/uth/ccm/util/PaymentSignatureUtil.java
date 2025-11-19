package nhom12.uth.ccm.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Utility class for verifying payment webhook signatures
 * Uses HMAC-SHA256 algorithm
 */
public class PaymentSignatureUtil {

    private static final String HMAC_SHA256 = "HmacSHA256";
    
    // Secret key for webhook signature verification
    // In production, this should be stored in environment variables or secure vault
    private static final String WEBHOOK_SECRET = "ccm_webhook_secret_key_2024";

    /**
     * Verify webhook signature
     * @param payload The payload string to verify
     * @param signature The signature from webhook request
     * @return true if signature is valid, false otherwise
     */
    public static boolean verifySignature(String payload, String signature) {
        try {
            String expectedSignature = generateSignature(payload);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Generate HMAC-SHA256 signature for a payload
     * @param payload The payload to sign
     * @return Base64 encoded signature
     */
    public static String generateSignature(String payload) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance(HMAC_SHA256);
        SecretKeySpec secretKeySpec = new SecretKeySpec(
            WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), 
            HMAC_SHA256
        );
        mac.init(secretKeySpec);
        
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }

    /**
     * Create payload string from webhook data
     * Format: referenceNumber|status|amount|timestamp
     */
    public static String createPayload(String referenceNumber, String status, String amount, Long timestamp) {
        return String.format("%s|%s|%s|%d", referenceNumber, status, amount, timestamp);
    }
}
