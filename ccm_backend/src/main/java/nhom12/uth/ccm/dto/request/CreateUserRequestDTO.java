package nhom12.uth.ccm.dto.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequestDTO {
    private String email;
    private String password;
    private String phoneNumber;
    private String firstName;
    private String lastName;
}
