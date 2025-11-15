package nhom12.uth.ccm.service;

import io.jsonwebtoken.Claims;
import nhom12.uth.ccm.dto.request.AuthenticationRequest;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.function.Function;

// token generate
public interface IJwtService {
     String extractUserEmail(String token);
     String extractUserId(String token);
     <T> T extractClaims(String token, Function<Claims, T> claimsResolver);
     String generateToken(UserDetails userDetails);
     String generateToken(Map<String, Object> extraClaims, UserDetails userDetails );
     boolean isTokenValid(String token,UserDetails userDetails);

}
