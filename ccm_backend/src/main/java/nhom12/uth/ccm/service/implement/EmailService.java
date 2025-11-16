//package nhom12.uth.ccm.service.implement;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//import nhom12.uth.ccm.service.IEmailService;
//
//@Service // Đánh dấu đây là một Service để Spring quản lý
//public class EmailService implements IEmailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Override
//    public void sendSimpleEmail(String toEmail, String subject, String body) {
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setFrom("tthanhvu367@gmail.com"); // Tên người gửi hiển thị
//            message.setTo(toEmail);
//            message.setSubject(subject);
//            message.setText(body);
//
//            mailSender.send(message);
//            System.out.println("Mail sent successfully to " + toEmail);
//        } catch (Exception e) {
//            System.err.println("Error sending email: " + e.getMessage());
//        }
//    }
//
//    @Override
//    public void sendOtpEmail(String toEmail, String otpCode) {
//        String subject = "Mã xác thực OTP của bạn";
//        String body = "Xin chào,\n\n" +
//                "Mã OTP của bạn là: " + otpCode + "\n" +
//                "Mã này sẽ hết hạn trong vòng 5 phút.\n\n" +
//                "Trân trọng,\n" +
//                "Đội ngũ Carbon Credit Market";
//
//        sendSimpleEmail(toEmail, subject, body);
//    }
//}