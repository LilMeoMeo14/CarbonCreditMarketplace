package nhom12.uth.ccm.service.implement;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.dto.request.AuthenticationRequest;

import nhom12.uth.ccm.dto.respone.AuthenticationResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IAuthenticationService;
import nhom12.uth.ccm.service.IJwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
public class AuthenticationService implements IAuthenticationService {

    IUserRepository userRepository;
    PasswordEncoder passwordEncoder;
    IJwtService  jwtService;
    AuthenticationManager authenticationManager;
    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getEmail(),
                        authenticationRequest.getPassword()
                )
        );
        var user = userRepository.findByEmail(authenticationRequest
                .getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_FOUND));

        // tao token
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                // .authenticated(true) // <-- Bỏ cái này
                .token(jwtToken)
                .build();
    }

}
