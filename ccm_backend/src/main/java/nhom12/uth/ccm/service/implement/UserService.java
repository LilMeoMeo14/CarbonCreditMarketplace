package nhom12.uth.ccm.service.implement;

import nhom12.uth.ccm.dto.request.CreateUserRequest;
import nhom12.uth.ccm.dto.request.UpdateUserRequest;
import nhom12.uth.ccm.dto.request.ChangePasswordRequest;
import nhom12.uth.ccm.dto.request.UpdateProfileRequest;
import nhom12.uth.ccm.dto.response.UserResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.UserMapper;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.ICarbonWalletService;
import nhom12.uth.ccm.service.IUserService;
import nhom12.uth.ccm.service.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private ICarbonWalletService carbonWalletService;

    // tao user moi
    @Override
    public UserResponse createUser(CreateUserRequest requestDTO) {

        // kiem tra email co nguoi su dung chua
        if (userRepository.existsByEmail(requestDTO.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        // kiem tra sdt co nguoi su dung chua
        if (userRepository.existsByPhoneNumber(requestDTO.getPhoneNumber()))
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        // kiem tra password nhap da dung chua
        if (!(requestDTO.getPassword().equals(requestDTO.getReTypePassword()))) {
            throw new AppException(ErrorCode.PASSWORD_RETYPE);
        }
        // mapping user
        User user = userMapper.toUser(requestDTO);
        // hashing password
        String hashedPassword = passwordEncoder.encode(requestDTO.getPassword());
        user.setPasswordHash(hashedPassword);
        User userSaved = userRepository.save(user);
        carbonWalletService.createWalletForUser(userSaved);
        // luu vao database
        return userMapper.toUserResponeDTO(userSaved);
    }

    @Override
    public List<UserResponse> getUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(userMapper::toUserResponeDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(String userId) {
        return userMapper.toUserResponeDTO(
                userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    @Override
    public UserResponse updateUser(UpdateUserRequest updateUserRequestDTO, String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // mapper nay cau hinh de bo qua truong email va phone
        userMapper.updateUser(user, updateUserRequestDTO);

        // cap nhat email
        if (updateUserRequestDTO.getEmail() != null
                && !updateUserRequestDTO.getEmail().isEmpty()
                && !updateUserRequestDTO.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateUserRequestDTO.getEmail())) {
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            }
            user.setEmail(updateUserRequestDTO.getEmail());
        }

        // cap nhat phone number
        if (updateUserRequestDTO.getPhoneNumber() != null
                && !updateUserRequestDTO.getPhoneNumber().isEmpty()
                && !updateUserRequestDTO.getPhoneNumber().equals(user.getPhoneNumber())) {
            if (userRepository.existsByPhoneNumber(updateUserRequestDTO.getPhoneNumber())) {
                throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
            }
            user.setPhoneNumber(updateUserRequestDTO.getPhoneNumber());
        }

        return userMapper.toUserResponeDTO(userRepository.save(user));
    }

    @Override
    public void deleteUserById(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }

    @Override
    public UserResponse getProfile(String userId) {
        return getUserById(userId);
    }

    @Override
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            user.setFirstName(request.getFirstName().trim());
        }
        
        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            user.setLastName(request.getLastName().trim());
        }
        
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            String newPhone = request.getPhoneNumber().trim();
            if (!newPhone.equals(user.getPhoneNumber())) {
                if (userRepository.existsByPhoneNumber(newPhone)) {
                    throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
                }
                user.setPhoneNumber(newPhone);
            }
        }
        
        User updatedUser = userRepository.save(user);
        return userMapper.toUserResponeDTO(updatedUser);
    }

    @Override
    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);
        }
        
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }
        
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserResponse uploadAvatar(String userId, MultipartFile file) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponeDTO(user);
    }

    @Override
    public void logout(String token) {
        tokenBlacklistService.addToBlacklist(token);
    }
}