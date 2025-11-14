package nhom12.uth.ccm.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateUserRequestDTO {
    private String email;
    private String password;
    private String phoneNumber;
    private String firstName;
    private String lastName;
}
