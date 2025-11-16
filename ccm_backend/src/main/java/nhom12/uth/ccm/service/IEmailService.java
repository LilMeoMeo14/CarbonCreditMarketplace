package nhom12.uth.ccm.service;

public interface IEmailService {
    // Hàm gửi email đ
    void sendSimpleEmail(String toEmail, String subject, String body);
    
    // Hàm gửi OTP 
    void sendOtpEmail(String toEmail, String otpCode);
}