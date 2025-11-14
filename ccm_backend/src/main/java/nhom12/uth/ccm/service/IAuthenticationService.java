package nhom12.uth.ccm.service;


import nhom12.uth.ccm.dto.request.AuthenticationRequest;

public interface IAuthenticationService {
    boolean authenticate(AuthenticationRequest AuthenticationRequest);
}
