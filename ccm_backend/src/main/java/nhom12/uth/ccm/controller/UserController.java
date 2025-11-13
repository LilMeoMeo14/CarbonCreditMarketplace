package nhom12.uth.ccm.controller;


import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/users")
    User createUser(@RequestBody CreateUserRequestDTO createUserRequestDTO) {
        return userService.createUser(createUserRequestDTO);
    }
}
