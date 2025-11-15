package nhom12.uth.ccm.controller;

import lombok.Builder;
import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.exception.ApiRespone;
import nhom12.uth.ccm.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/users")

public class UserController {
    @Autowired
    private IUserService userService;



    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    ApiRespone<UserResponeDTO> createUser(@RequestBody @Valid CreateUserRequestDTO createUserRequestDTO) { /*
                                                                                                  * anotation valid
                                                                                                  * thong bao cho spring
                                                                                                  * biet la can phai
                                                                                                  * validate
                                                                                                  * CreateUserRequestDTO
                                                                                                  */
        return ApiRespone.<UserResponeDTO>builder()
                .result(userService.createUser(createUserRequestDTO))
                .code(1000)
                .build();
    }

    @GetMapping
    ApiRespone<List<UserResponeDTO>> getAllUsers() {
        return ApiRespone.<List<UserResponeDTO>>builder()
                .result(userService.getUsers())
                .code(1000)
                .build();
    }

    @GetMapping("/{userId}")
    ApiRespone<UserResponeDTO> getUserById(@PathVariable("userId") String userId) {
        return ApiRespone.<UserResponeDTO>builder()
                .result(userService.getUserById(userId))
                .code(1000)
                .build();
    }

    @PutMapping("/{userId}")
    ApiRespone<UserResponeDTO> updateUser(@RequestBody UpdateUserRequestDTO updateUserRequestDTO, @PathVariable("userId") String userId) {
        return ApiRespone.<UserResponeDTO>builder()
                .result(userService.updateUser(updateUserRequestDTO, userId))
                .code(1000)
                .build();
    }

    @DeleteMapping("/{userId}")
    ApiRespone<String> deleteUserById(@PathVariable("userId") String userId) {
        userService.deleteUserById(userId);
        return ApiRespone.<String>builder()
                .result("User was successfully deleted")
                .code(1000)
                .build();
    }
}
