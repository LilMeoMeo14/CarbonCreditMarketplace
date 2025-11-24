package nhom12.uth.ccm.dto.request;

import lombok.*;
import nhom12.uth.ccm.model.enums.UserRole;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserRequest {
    private String email;
    private String password;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private UserRole role;
}
