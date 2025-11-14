package nhom12.uth.ccm.exception;

import nhom12.uth.ccm.dto.respone.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice // Dùng annotation này để tự động trả về JSON
public class GlobalExceptionHandler {

    // 1. Xử lý lỗi ngoại lệ chung (RuntimeException)
    // Ví dụ: Ném ra throw new RuntimeException("User not found");
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage()) // Lấy message từ exception
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // 2. Xử lý lỗi Validate dữ liệu (@Valid) - Quan trọng cho API đăng ký/đăng nhập
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        List<ApiResponse.ValidationError> errors = new ArrayList<>();

        // Lặp qua tất cả các lỗi của các trường (field)
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.add(new ApiResponse.ValidationError(error.getField(), error.getDefaultMessage()));
        }

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message("Invalid request parameters")
                .errors(errors) // Gán danh sách lỗi chi tiết vào
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    // 3. Xử lý lỗi hệ thống không mong muốn (Exception.class) - Trả về 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnwantedException(Exception ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message("An unexpected error occurred: " + ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    // 4. Xử lý lỗi Không tìm thấy (Trả về 404 Not Found)
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFoundException(UserNotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // 5. Xử lý lỗi Không đủ tín chỉ (Trả về 409 Conflict)
    @ExceptionHandler(InsufficientCreditsException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsufficientCreditsException(InsufficientCreditsException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
}