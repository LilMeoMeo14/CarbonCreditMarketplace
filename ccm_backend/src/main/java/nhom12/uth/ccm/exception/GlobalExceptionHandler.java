package nhom12.uth.ccm.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice; // Đổi từ @ControllerAdvice sang @RestControllerAdvice cho chuẩn REST

@Slf4j
@RestControllerAdvice // anotation de thong bao cho spring biet day la noi chua tat ca cac exception
public class GlobalExceptionHandler {

    // Xử lý lỗi RuntimeException
    // Trả về 400 Bad Request

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiRespone> handlerRuntimeException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ApiRespone apiRespone = ApiRespone.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.badRequest().body(apiRespone);
    }

    // Validation (MethodArgumentNotValidException)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiRespone> handlerMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String enumKey = ex.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.INVALID_MESSAGE_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        }catch (Exception e) {
            log.error(enumKey + ":" + e.getMessage());
        }
        ApiRespone apiRespone = ApiRespone.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.badRequest().body(apiRespone);
    }

    // Validation 500, ....
    @ExceptionHandler(value = RuntimeException.class) // Bắt tất cả RuntimeException
    public ResponseEntity<ApiRespone> handlerGeneralRuntimeException(RuntimeException ex) { // Tham số là RuntimeException

        // Print log ra console
        ex.printStackTrace();

        ApiRespone apiRespone = ApiRespone.builder()
                .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                .message(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage())
                .build();

        // Error 500
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiRespone);
    }
}