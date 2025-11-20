package nhom12.uth.ccm.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // Invalid key
    INVALID_MESSAGE_KEY(00001, "Invalid message key"),
    INVALID_USERREQUEST(00002, "Invalid Uer request"),

    // validation
    EMAIL_EXISTED(1001, "EMAIL EXISTED"),
    PHONENUMBER_EXISTED(1002, "Phone NUMBER EXISTED"),

    FILE_NULL(1007, "File cannot be null"),
    FILE_SIZE_TOO_LARGE(1008, "File size exceeds limit"),
    FILE_UPLOAD_FAILED(1009, "Failed to upload file"),

    // validation cho du lieu dau vai
    EMAIL_INVALID(2001, "Invalid email"),
    PHONENUMBER_INVALID(2002, "Phone numer muse be 10 digits"),
    PASSWORD_INVALID(2003, "Passowrd must be 8 - 30 characters long"),
    PASSWORD_INCORRECT(2004, "Password incorrect"),
    PASSWORD_RETYPE(2005, "Retype password is incorrect"),

    // validation not founds
    USER_NOT_FOUND(3001, "User not found"),
    EMAIL_NOT_FOUND(3002, "Email not found"),
    PHONENUMBER_NOT_FOUND(3003, "Phone number not found"),
    EV_PROFILE_NOT_FOUND(3004, "Vehicle not found"),
    FILE_NOT_FOUND(3005, "File not found"),

    // validation error
    UNAUTHENTICATED(4001, "Unauthorized"),

    // loi khong xac dinh
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi hệ thống không xác định");

    ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
