package nhom12.uth.ccm.service;

import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;

public interface IJwtService {

    String generateToken(String email);

    /**
     * Trích xuất username (email) từ token.
     */
    String extractUsername(String token);

    /**
     * Trích xuất thời gian hết hạn.
     */
    Date extractExpiration(String token);

    /**
     * Trích xuất một claim cụ thể.
     */
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    /**
     * Kiểm tra token có hợp lệ không.
     */
    Boolean validateToken(String token, UserDetails userDetails);

    /**
     * Kiểm tra token đã hết hạn chưa (Helper method).
     */
    boolean isTokenExpired(String token);

    // ==================================================
    // === CÁC HÀM TẠO TOKEN (MỚI) ===
    // ==================================================

    /**
     * Tạo Access Token (Thời hạn ngắn: VD 15 phút).
     * Chứa thông tin quan trọng: Roles, UserID... để phân quyền.
     */
    String generateAccessToken(UserDetails userDetails);

    /**
     * Tạo Refresh Token (Thời hạn dài: VD 7 ngày).
     * Dùng để xin cấp lại Access Token mới khi cái cũ hết hạn.
     */
    String generateRefreshToken(UserDetails userDetails);
}