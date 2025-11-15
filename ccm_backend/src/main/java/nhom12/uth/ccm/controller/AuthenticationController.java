package nhom12.uth.ccm.controller;


import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.dto.request.AuthenticationRequest;
import nhom12.uth.ccm.dto.respone.AuthenticationResponse;
import nhom12.uth.ccm.exception.ApiRespone;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.service.IAuthenticationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
public class AuthenticationController {


    final IAuthenticationService authenticationService;

    @PostMapping("/login")
    ApiRespone<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest){
        return ApiRespone.<AuthenticationResponse>builder()
                .result(authenticationService.authenticate(authenticationRequest))
                .code(1000)
                .build();
    }
}
