package nhom12.uth.ccm.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nhom12.uth.ccm.model.enums.UserRole;
import nhom12.uth.ccm.model.enums.UserStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateUserRequest {
    @Email(message = "invalid email")
    private String email;
    @Size(min = 8, max = 30, message = "PASSWORD_INVALID")
    private String password;
    private String reTypePassword;
    @Size(min = 10, max = 10, message = "PHONENUMBER_INVALID")
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private UserRole role;
    private UserStatus status = UserStatus.ACTIVE;
}
