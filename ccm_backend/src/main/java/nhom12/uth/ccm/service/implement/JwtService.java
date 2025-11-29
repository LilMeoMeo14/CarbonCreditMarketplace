package nhom12.uth.ccm.service.implement;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.service.IJwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService implements IJwtService {

    @Value("${jwt.secret-key}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    @Override
    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    @Override
    public String generateRefreshToken(UserDetails userDetails) {
        // Refresh token có thời gian sống lâu hơn (ví dụ: 7 ngày = 604800000 ms)
        // Tạm thời mình để cứng hoặc bạn có thể thêm vào application.properties
        long refreshExpiration = 604800000;
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }

    // Hàm generateToken cũ (để tương thích nếu bạn còn dùng)
    @Override
    public String generateToken(String email) {
        // Logic này hơi cũ, nên dùng generateAccessToken(UserDetails)
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey())
                .compact();
    }

    // Hàm hỗ trợ tạo token với Claims tùy chỉnh
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, EXPIRATION_TIME);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        // Thêm custom claims (userId và role)
        if (userDetails instanceof User) {
            var user = (User) userDetails;
            extraClaims.put("userId", user.getUserId());
            extraClaims.put("role", user.getUserRole().name());
        }

        return Jwts.builder()
                .claims(extraClaims) // Cú pháp mới: dùng .claims() hoặc .setClaims()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignKey()) // Không cần SignatureAlgorithm.HS256 nữa, nó tự hiểu từ key
                .compact();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @Override
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // === CẬP NHẬT QUAN TRỌNG: Cú pháp mới cho JJWT 0.12.x ===
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey()) // Thay cho setSigningKey()
                .build()
                .parseSignedClaims(token) // Thay cho parseClaimsJws()
                .getPayload(); // Thay cho getBody()
    }

    @Override
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    @Override
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}