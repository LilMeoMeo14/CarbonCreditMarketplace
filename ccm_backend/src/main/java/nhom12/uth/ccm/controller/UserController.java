package nhom12.uth.ccm.controller;

import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.exception.ApiRespone;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    ApiRespone<User> createUser(@RequestBody @Valid CreateUserRequestDTO createUserRequestDTO) { /*
                                                                                                  * anotation valid
                                                                                                  * thong bao cho spring
                                                                                                  * biet la can phai
                                                                                                  * validate
                                                                                                  * CreateUserRequestDTO
                                                                                                  */
        ApiRespone<User> apiRespone = new ApiRespone();
        apiRespone.setResult(userService.createUser(createUserRequestDTO));
        return apiRespone;
    }

    @GetMapping
    List<User> getAllUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{userId}")
    UserResponeDTO getUserById(@PathVariable("userId") String userId) {
        return userService.getUserById(userId);
    }

    @PutMapping("/{userId}")
    UserResponeDTO updateUser(@RequestBody UpdateUserRequestDTO updateUserRequestDTO, @PathVariable("userId") String userId) {
        return userService.updateUser(updateUserRequestDTO, userId);
    }

    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable("userId") String userId) {
        userService.DeleteUserById(userId);
        return "User was successfully delete";
    }

}
