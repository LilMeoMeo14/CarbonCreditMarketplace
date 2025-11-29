package nhom12.uth.ccm.service.implement;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.dto.request.AuthenticationRequest;
import nhom12.uth.ccm.dto.request.CreateUserRequest;
import nhom12.uth.ccm.dto.request.LogoutRequest;
import nhom12.uth.ccm.dto.request.RefreshTokenRequest;
import nhom12.uth.ccm.dto.response.AuthenticationResponse;
import nhom12.uth.ccm.dto.response.UserResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.UserMapper;
import nhom12.uth.ccm.model.User;
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
        UserMapper userMapper;

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
                UserResponse userDTO = userMapper.toUserResponeDTO(user);
                // tra ve token

                return AuthenticationResponse.builder()
                                .accessToken(token)
                                .success(true)
                                .user(userDTO)
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
                                .accessToken(token)
                                .success(true)
                                .build();
        }

        @Override
        public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
                String token = request.getToken();

                // 1. Lấy email từ refresh token
                String email = jwtService.extractUsername(token);

                // 2. Tìm user trong DB
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                // 3. Kiểm tra token có hợp lệ không
                if (jwtService.validateToken(token, user)) {

                        // 4. Tạo Access Token MỚI
                        String newAccessToken = jwtService.generateAccessToken(user);

                        // 5. Trả về Response kèm User Info
                        return AuthenticationResponse.builder()
                                        .accessToken(newAccessToken)
                                        .refreshToken(token) // Trả lại token cũ (hoặc tạo mới nếu muốn xoay vòng)
                                        .success(true)
                                        .user(userMapper.toUserResponeDTO(user))
                                        .build();
                }

                throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

    @Override
    public void logout(LogoutRequest request) {
        var token = request.getToken();
        System.out.println("Logout request for token: " + token);
    }
}
