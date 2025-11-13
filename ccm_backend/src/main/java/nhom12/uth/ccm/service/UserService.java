package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.UserRole;
import nhom12.uth.ccm.model.enums.UserStatus;
import nhom12.uth.ccm.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService{
    @Autowired
    private IUserRepository userRepository;

    // tao user moi
    @Override
    public User createUser(CreateUserRequestDTO requestDTO) {
        // kiem tra email co nguoi su dung chua

        // kiem tra sdt co nguoi su dung chua

        // hashpassword

        // khoi tao user moi
        User user = new User();

        user.setFirstName(requestDTO.getFirstName());
        user.setLastName(requestDTO.getLastName());
        user.setEmail(requestDTO.getEmail());
        user.setPhoneNumber(requestDTO.getPhoneNumber());
        // set password da ma hoa
        user.setPasswordHash(requestDTO.getPassword());
        user.setUserRole(UserRole.EV_OWNER); // mac dinh la EV_OWNER
        user.setStatus(UserStatus.ACTIVE); // mac dinh la active

        // luu vao database
        return userRepository.save(user);
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(String userId) {
        return  userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User updateUser(UpdateUserRequestDTO updateUserRequestDTO, String userId) {
        User user = getUserById(userId);
        user.setFirstName(updateUserRequestDTO.getFirstName());
        user.setLastName(updateUserRequestDTO.getLastName());
        user.setEmail(updateUserRequestDTO.getEmail());
        user.setPhoneNumber(updateUserRequestDTO.getPhoneNumber());
        user.setPasswordHash(updateUserRequestDTO.getPassword());

        return userRepository.save(user);
    }

    @Override
    public void DeleteUserById(String userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }
}
