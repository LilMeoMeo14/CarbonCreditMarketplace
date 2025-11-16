package nhom12.uth.ccm.controller;

import lombok.AccessLevel;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.dto.request.AuthenticationRequest;
import nhom12.uth.ccm.dto.request.CreateUserRequest;
import nhom12.uth.ccm.dto.response.AuthenticationResponse;
import nhom12.uth.ccm.exception.ApiRespone;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.service.IAuthenticationService;
import nhom12.uth.ccm.service.IJwtService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    final IAuthenticationService authenticationService;
    private AuthenticationManager authenticationManager;
    private IJwtService jwtService;

    @PostMapping("/login")
    ApiRespone<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        /*
         * Luong hoat dong
         * 1. goi service . service tra ve dto chua token
         * -> sai thi nem ra Exception
         * 2. set Result voi goi dto chua token duoc tra ve
         */

        AuthenticationResponse authenticationResponse = authenticationService.login(authenticationRequest);

        return ApiRespone.<AuthenticationResponse>builder()
                .result(authenticationResponse)
                .code(1000)
                .build();
    }

    @PostMapping("/register")
    ApiRespone<AuthenticationResponse> register(@RequestBody CreateUserRequest createUserRequestDTO) {
        /*
         * Luong hoat dong
         * 1. Kiem tra email
         * 2. Kiem tra phone
         * 3. Luu vao repo
         * 4. Tao token
         * 5. Tra ve api respone
         */

        AuthenticationResponse authenticationResponse = authenticationService.register(createUserRequestDTO);

        return ApiRespone.<AuthenticationResponse>builder()
                .result(authenticationResponse)
                .code(1000)
                .build();

    }

    @PostMapping("/generateToken")
    ApiRespone<String> authenticateAndGeToken(@RequestBody AuthenticationRequest authenticationRequest) {
        // TODO: process POST request
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(),
                        authenticationRequest.getPassword()));

        if (authentication.isAuthenticated()) {

            return ApiRespone.<String>builder()
                    .result(jwtService.generateToken(authenticationRequest.getEmail()))
                    .code(1000)
                    .build();
        } else {
            throw new AppException(ErrorCode.INVALID_USERREQUEST);
        }
    }

}
