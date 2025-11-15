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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService implements IAuthenticationService {

        @Autowired
        IUserRepository userRepository;
        @Autowired
        PasswordEncoder passwordEncoder;

        @Override
        public Boolean authenticate(AuthenticationRequest authenticationRequest) {
                var user = userRepository.findByEmail(authenticationRequest
                                .getEmail())
                                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_FOUND));
                passwordEncoder.encode(authenticationRequest.getPassword());
                return passwordEncoder.matches(authenticationRequest.getPassword(), user.getPasswordHash());
        }

}
