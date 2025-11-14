package nhom12.uth.ccm.dto.respone;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.UserRole;
import nhom12.uth.ccm.model.enums.UserStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponeDTO {
    String email;
    String password;
    String phoneNumber;
    String firstName;
    String lastName;
    UserRole role;
    UserStatus status =  UserStatus.ACTIVE;
}
