package nhom12.uth.ccm.controller;

import nhom12.uth.ccm.dto.request.CreateUserRequest;
import nhom12.uth.ccm.dto.request.UpdateUserRequest;
import nhom12.uth.ccm.dto.response.UserResponse;
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
    ApiRespone<UserResponse> createUser(@RequestBody @Valid CreateUserRequest createUserRequestDTO) { /*
                                                                                                       * anotation
                                                                                                       * valid
                                                                                                       * thong bao
                                                                                                       * cho spring
                                                                                                       * biet la
                                                                                                       * can phai
                                                                                                       * validate
                                                                                                       * CreateUserRequestDTO
                                                                                                       */
        return ApiRespone.<UserResponse>builder()
                .result(userService.createUser(createUserRequestDTO))
                .code(1000)
                .build();
    }

    @GetMapping
    ApiRespone<List<UserResponse>> getAllUsers() {
        return ApiRespone.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .code(1000)
                .build();
    }

    @GetMapping("/{userId}")
    ApiRespone<UserResponse> getUserById(@PathVariable("userId") String userId) {
        return ApiRespone.<UserResponse>builder()
                .result(userService.getUserById(userId))
                .code(1000)
                .build();
    }

    @PutMapping("/{userId}")
    ApiRespone<UserResponse> updateUser(@RequestBody UpdateUserRequest updateUserRequestDTO,
            @PathVariable("userId") String userId) {
        return ApiRespone.<UserResponse>builder()
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
