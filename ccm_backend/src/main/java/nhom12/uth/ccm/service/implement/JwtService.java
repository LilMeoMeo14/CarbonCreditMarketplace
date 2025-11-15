package nhom12.uth.ccm.service.implement;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.service.IJwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
@Service
public class JwtService implements IJwtService {

    @Value("${jwt.secret-key}")
    private String SitRitKEY;
    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    @Override
    public String extractUserEmail(String token) {
        return extractClaims(token, Claims::getSubject); // subject la email
    }

    @Override
    public String extractUserId(String token) {
        return extractClaims(token,claims -> claims.get("userId",String.class));
    }

    @Override
    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    @Override
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        // Thêm custom claims (userId và role) vào token
        if (userDetails instanceof User) {
            var user = (User) userDetails;
            extraClaims.put("userId", user.getUserId()); // <-- Gán userId
            extraClaims.put("role", user.getUserRole().name()); // <-- Gán role
        }

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // Subject (sub) VẪN LÀ EMAIL
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String useremail = extractUserEmail(token);
        return (useremail.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SitRitKEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
