package nhom12.uth.ccm.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // Invalid key
    INVALID_MESSAGE_KEY(00001, "Invalid message key"),
    INVALID_USERREQUEST(00002, "Invalid Uer request"),

    // validation
    EMAIL_EXISTED(1001, "EMAIL EXISTED"),
    PHONENUMBER_EXISTED(1002, "Phone NUMBER EXISTED"),

    // validation cho du lieu dau vai
    EMAIL_INVALID(2001, "Invalid email"),
    PHONENUMBER_INVALID(2002, "Phone numer muse be 10 digits"),
    PASSWORD_INVALID(2003, "Passowrd must be 8 - 30 characters long"),
    PASSWORD_INCORRECT(2004, "Password incorrect"),
    PASSWORD_RETYPE(2005, "Retype password is incorrect"),

    // validation not found
    USER_NOT_FOUND(3001, "User not found"),
    EMAIL_NOT_FOUND(3002, "Email not found"),
    PHONENUMBER_NOT_FOUND(3003, "Phone number not found"),
    EV_PROFILE_NOT_FOUND(3004, "Vehicle not found"),
    CARBON_WALLET_NOT_FOUND(3005, "Carbon wallet not found"),
    EWALLET_NOT_FOUND(3006, "E-wallet not found"),
    PAYMENT_TRANSACTION_NOT_FOUND(3007, "Payment transaction not found"),

    // validation error
    UNAUTHENTICATED(4001, "Unauthorized"),
    INSUFFICIENT_BALANCE(4002, "Insufficient balance"),
    INVALID_AMOUNT(4003, "Invalid amount"),
    INVALID_SIGNATURE(4004, "Invalid webhook signature"),
    PAYMENT_ALREADY_PROCESSED(4005, "Payment transaction already processed"),

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
