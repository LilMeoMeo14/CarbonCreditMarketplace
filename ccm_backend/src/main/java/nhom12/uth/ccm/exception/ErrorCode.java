package nhom12.uth.ccm.exception;


import lombok.Getter;

@Getter
public enum ErrorCode {

    // Invalid key
    INVALID_MESSAGE_KEY(00001, "Invalid message key"),

    // validation
    EMAIL_EXISTED(1001,"EMAIL EXISTED"),
    PHONENUMBER_EXISTED(1002,"Phone NUMBER EXISTED"),

    // validation cho du lieu dau vai
    EMAIL_INVALID(2001,"Invalid email"),
    PHONENUMBER_INVALID(2002,"Phone numer invalid"),
    PASSWORD_INVALID(2003,"Passowrd must be 8 - 30 characters long"),

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
