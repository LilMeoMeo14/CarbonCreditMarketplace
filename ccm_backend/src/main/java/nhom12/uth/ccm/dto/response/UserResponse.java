package nhom12.uth.ccm.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import nhom12.uth.ccm.model.enums.UserRole;
import nhom12.uth.ccm.model.enums.UserStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userId;
    String password;
    String email;
    String phoneNumber;
    String firstName;
    String lastName;
    UserRole role;
    UserStatus status;
}
