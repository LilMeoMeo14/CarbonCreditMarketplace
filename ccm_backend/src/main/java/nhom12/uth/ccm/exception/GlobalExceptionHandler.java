package nhom12.uth.ccm.exception;

import java.lang.reflect.Method;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

// anotation de thong bao cho spring biet day la noi chua tat ca cac exception
@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý lỗi RuntimeException
    // Trả về 400 Bad Request

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handlerRuntimeException(Exception ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<String> handlerMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body(ex.getFieldError().getDefaultMessage());
    }

}
