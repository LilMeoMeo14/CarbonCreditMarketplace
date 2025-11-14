package nhom12.uth.ccm.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequestDTO {
    @Email(message = "invalid email")
    private String email;
    @Size(min = 8, max = 30, message = "Password must be 8 to 30 character")
    private String password;
    private String phoneNumber;
    private String firstName;
    private String lastName;
}
