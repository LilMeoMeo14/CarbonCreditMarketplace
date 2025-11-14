package nhom12.uth.ccm.controller;

import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.exception.ApiRespone;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.service.IUserService;
import nhom12.uth.ccm.service.UserService;
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
        ApiRespone<UserResponeDTO> apiRespone = new ApiRespone<>();
        apiRespone.setResult(userService.createUser(createUserRequestDTO));
        return apiRespone;
    }

    @GetMapping
    ApiRespone<List<UserResponeDTO>> getAllUsers() {
        ApiRespone<List<UserResponeDTO>> apiRespone = new ApiRespone<>();
        apiRespone.setResult(userService.getUsers());
        return apiRespone;
    }

    @GetMapping("/{userId}")
    ApiRespone<UserResponeDTO> getUserById(@PathVariable("userId") String userId) {
        ApiRespone<UserResponeDTO> apiRespone = new ApiRespone<>();
        apiRespone.setResult(userService.getUserById(userId));
        return apiRespone;
    }

    @PutMapping("/{userId}")
    ApiRespone<UserResponeDTO> updateUser(@RequestBody UpdateUserRequestDTO updateUserRequestDTO, @PathVariable("userId") String userId) {
        ApiRespone<UserResponeDTO> apiRespone = new ApiRespone<>();
        apiRespone.setResult(userService.updateUser(updateUserRequestDTO,userId));
        return apiRespone;
    }

    @DeleteMapping("/{userId}")
    ApiRespone<UserResponeDTO> deleteUser(@PathVariable("userId") String userId) {
        ApiRespone<UserResponeDTO> apiRespone = new ApiRespone<>();
        apiRespone.setMessage("User was successfully delete");
        return apiRespone;
    }

}
