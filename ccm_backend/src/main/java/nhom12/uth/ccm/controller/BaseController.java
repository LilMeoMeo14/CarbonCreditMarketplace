package nhom12.uth.ccm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.IUserRepository;

public abstract class BaseController {
    @Autowired
    protected IUserRepository userRepository;

    // lay userId tu token
    public String getAuthenticatedUserId() {
        // lay thong tin xac thuc tu spring security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // kiem tra xem co ai dang dang nhap khong

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return user.getUserId();
    }
}
