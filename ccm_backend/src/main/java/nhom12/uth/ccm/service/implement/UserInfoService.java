package nhom12.uth.ccm.service.implement;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.IUserRepository;

@Service
public class UserInfoService implements UserDetailsService {

    private final IUserRepository userRepository;

    @Autowired
    public UserInfoService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm user
        Optional<User> userOptional = userRepository.findByEmail(username);

        if (userOptional.isEmpty()) {

            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        return new UserInfoDetails(userOptional.get());
    }
}