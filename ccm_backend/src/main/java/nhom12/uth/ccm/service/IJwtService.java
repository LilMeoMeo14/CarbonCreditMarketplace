package nhom12.uth.ccm.service;

import java.util.Date;

import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;

public interface IJwtService {

    /**
     * Tạo ra một JWT token mới dựa trên email (username).
     *
     * @param email Email của người dùng
     * @return Chuỗi JWT
     */
    String generateToken(String email);

    /**
     * Trích xuất username (email) từ 'sub' claim của token.
     *
     * @param token Chuỗi JWT
     * @return Email (username)
     */
    String extractUsername(String token);

    /**
     * Trích xuất thời gian hết hạn từ token.
     *
     * @param token Chuỗi JWT
     * @return Ngày hết hạn
     */
    Date extractExpiration(String token);

    /**
     * Trích xuất một claim (trường) cụ thể từ payload của token.
     *
     * @param token          Chuỗi JWT
     * @param claimsResolver Một function để chỉ định claim nào cần lấy
     * @param <T>            Kiểu dữ liệu của claim (ví dụ: String, Date)
     * @return Giá trị của claim
     */
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    /**
     * Kiểm tra xem token có hợp lệ không (so với UserDetails).
     *
     * @param token       Chuỗi JWT
     * @param userDetails Đối tượng UserDetails (lấy từ DB)
     * @return True nếu token hợp lệ, False nếu không
     */
    Boolean validateToken(String token, UserDetails userDetails);

}
