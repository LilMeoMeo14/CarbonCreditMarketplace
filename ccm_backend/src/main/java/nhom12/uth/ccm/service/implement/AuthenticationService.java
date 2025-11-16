package nhom12.uth.ccm.service.implement;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.dto.request.AuthenticationRequest;
import nhom12.uth.ccm.dto.request.CreateUserRequest;
import nhom12.uth.ccm.dto.response.AuthenticationResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IAuthenticationService;
import nhom12.uth.ccm.service.IJwtService;
import nhom12.uth.ccm.service.IUserService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService implements IAuthenticationService {

        IUserRepository userRepository;
        IUserService userService;
        AuthenticationManager authenticationManager;
        IJwtService jwtService;

        @Override
        public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                authenticationRequest.getEmail(),
                                                authenticationRequest.getPassword()));

                // neu khong loi tim user
                var user = userRepository.findByEmail(authenticationRequest
                                .getEmail())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                // tao jwt token
                String token = jwtService.generateToken(user.getEmail());

                // tra ve token

                return AuthenticationResponse.builder()
                                .token(token)
                                .success(true)
                                .build();

        }

        @Override
        public AuthenticationResponse register(CreateUserRequest createUserRequestDTO) {
                // goi service luu user
                userService.createUser(createUserRequestDTO);

                // gen jwt token
                String token = jwtService.generateToken(createUserRequestDTO.getEmail());

                // tra ve token

                return AuthenticationResponse.builder()
                                .token(token)
                                .success(true)
                                .build();
        }
}
