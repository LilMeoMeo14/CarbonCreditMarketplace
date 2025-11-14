package nhom12.uth.ccm.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;



@ControllerAdvice
// anotation de thong bao cho spring biet day la noi chua tat ca cac exception
public class GlobalExceptionHandler {

    // Xử lý lỗi RuntimeException
    // Trả về 400 Bad Request

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiRespone> handlerRuntimeException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ApiRespone apiRespone = new ApiRespone();
        apiRespone.setCode(errorCode.getCode());
        apiRespone.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiRespone);
    }

    // Validation (MethodArgumentNotValidException)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiRespone> handlerMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String enumKey = ex.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.valueOf(enumKey);
        ApiRespone apiRespone = new ApiRespone();
        apiRespone.setCode(errorCode.getCode());
        apiRespone.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiRespone);
    }

    // Validation 500, ....
    @ExceptionHandler(value = RuntimeException.class) // Bắt tất cả RuntimeException
    public ResponseEntity<ApiRespone> handlerGeneralRuntimeException(RuntimeException ex) { // Tham số là RuntimeException

        // Print log ra console
        ex.printStackTrace();

        ApiRespone apiRespone = new ApiRespone();
        apiRespone.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiRespone.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

        // Error 500
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiRespone);
    }
}
