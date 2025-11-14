package nhom12.uth.ccm.service;

import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;

import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.model.User;

import java.util.List;

public interface IUserService {
    /*
     * Lấy tất cả người dùng
     *
     */
    List<User> getUsers();

    /*
     * Lấy người dùng theo ID
     */
    UserResponeDTO getUserById(String userId);

    /*
     * Tạo người dùng mới
     */
    User createUser(CreateUserRequestDTO requestDTO);

    /*
     * Cập nhật thông tin người dùng
     */
    UserResponeDTO updateUser(UpdateUserRequestDTO updateUserRequestDTO, String userId);

    /*
     * Xoa nguoi dung theo id
     */

    void DeleteUserById(String userId);

}
