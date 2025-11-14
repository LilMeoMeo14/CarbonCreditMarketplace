package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.mapper.UserMapper;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    // tao user moi
    @Override
    public User createUser(CreateUserRequestDTO requestDTO) {
        // hashpassword

        // kiem tra email co nguoi su dung chua
        if (userRepository.existsByEmail(requestDTO.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        // kiem tra sdt co nguoi su dung chua
        if (userRepository.existsByPhoneNumber(requestDTO.getPhoneNumber()))
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        // mapping user
        User user  = userMapper.toUser(requestDTO);
        // luu vao database
        return userRepository.save(user);
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserResponeDTO getUserById(String userId) {
        return userMapper.toUserResponeDTO(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
    }

    @Override
    public UserResponeDTO updateUser(UpdateUserRequestDTO updateUserRequestDTO, String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.updateUser(user, updateUserRequestDTO);
        return userMapper.toUserResponeDTO(userRepository.save(user));
    }

    @Override
    public void DeleteUserById(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
