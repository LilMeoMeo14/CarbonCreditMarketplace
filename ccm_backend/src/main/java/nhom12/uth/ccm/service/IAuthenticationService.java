package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.AuthenticationRequest;
import nhom12.uth.ccm.dto.request.CreateUserRequest;
import nhom12.uth.ccm.dto.response.AuthenticationResponse;

public interface IAuthenticationService {
    AuthenticationResponse login(AuthenticationRequest authenticationRequest);

    AuthenticationResponse register(CreateUserRequest createUserRequestDTO);
}
