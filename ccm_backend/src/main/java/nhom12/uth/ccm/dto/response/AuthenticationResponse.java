package nhom12.uth.ccm.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    /*
     * Checking email & password
     * Return True if email & password is correct
     */
    Boolean success;
    String token;
}
