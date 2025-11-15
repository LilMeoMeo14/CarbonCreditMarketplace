package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.AuthenticationRequest;
import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.AuthenticationResponse;

public interface IAuthenticationService {
    AuthenticationResponse login(AuthenticationRequest authenticationRequest);

    AuthenticationResponse register(CreateUserRequestDTO createUserRequestDTO);
}
