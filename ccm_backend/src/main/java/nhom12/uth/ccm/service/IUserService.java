package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.CreateUserRequest;
import nhom12.uth.ccm.dto.request.UpdateUserRequest;
import nhom12.uth.ccm.dto.response.UserResponse;

import java.util.List;

public interface IUserService {
    /*
     * Lấy tất cả người dùng
     *
     */
    List<UserResponse> getUsers();

    /*
     * Lấy người dùng theo ID
     */
    UserResponse getUserById(String userId);

    /*
     * Tạo người dùng mới
     */
    UserResponse createUser(CreateUserRequest requestDTO);

    /*
     * Cập nhật thông tin người dùng
     */
    UserResponse updateUser(UpdateUserRequest updateUserRequestDTO, String userId);

    /*
     * Xoa nguoi dung theo id
     */
    void deleteUserById(String userId);

}
