package nhom12.uth.ccm.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // anotation giup khong truyen cac gia tri null vao json
public class ApiRespone<T> {
    private int code = 1000; // thanh cong
    private String message;
    private T result;
}
