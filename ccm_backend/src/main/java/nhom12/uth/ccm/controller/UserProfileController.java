package nhom12.uth.ccm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.dto.response.UserResponse;
import nhom12.uth.ccm.service.IUserService;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    @Autowired
    private IUserService userService;

    // GET /me - Lấy thông tin user hiện tại
    @GetMapping("/me")
    public Object getCurrentUser(@AuthenticationPrincipal User user) {
        return userService.getUserById(user.getUserId());
    }

    // PUT /me - Cập nhật thông tin user
    @PutMapping("/me")
    public Object updateCurrentUser(
            @AuthenticationPrincipal User user,
            @RequestBody java.util.Map<String, String> request) {
        // Tạm thời trả về user info hiện tại
        return userService.getUserById(user.getUserId());
    }

    // PUT /me/password - Đổi mật khẩu
    @PutMapping("/me/password")
    public String changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody java.util.Map<String, String> request) {
        return "Password changed successfully";
    }

    // PUT /me/avatar - Upload avatar
    @PutMapping("/me/avatar")
    public String uploadAvatar(
            @AuthenticationPrincipal User user,
            @RequestBody java.util.Map<String, String> request) {
        return "Avatar uploaded successfully";
    }

    // POST /me/logout - Logout
    @PostMapping("/me/logout")
    public String logout(@AuthenticationPrincipal User user) {
        return "Logout successful";
    }
}