package nhom12.uth.ccm.controller;
import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    User createUser(@RequestBody CreateUserRequestDTO createUserRequestDTO) {
        return userService.createUser(createUserRequestDTO);
    }

    @GetMapping
    List<User> getAllUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{userId}")
    User getUserById(@PathVariable("userId") String userId) {
        return userService.getUserById(userId);
    }

}
