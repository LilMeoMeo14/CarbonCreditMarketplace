package nhom12.uth.ccm.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Quan trọng: Giấu các trường null (ví dụ lỗi thì giấu data, thành công thì
                                           // giấu errors)
public class ApiResponse<T> {

    private boolean success;
    private String message;

    // Dùng cho data trả về khi thành công (Object, List, ...)
    private T data;

    // Dùng cho danh sách lỗi khi validate form (nếu có)
    private List<ValidationError> errors;

    @Builder.Default
    private String timestamp = LocalDateTime.now().toString();

    // Class con để hứng lỗi chi tiết từng trường (field)
    @Data
    @AllArgsConstructor
    public static class ValidationError {
        private String field;
        private String message;
    }
}
