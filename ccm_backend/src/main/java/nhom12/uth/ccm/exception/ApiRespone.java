package nhom12.uth.ccm.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL) // khong them cac file null vao api tra ve
@Builder

public class ApiRespone<T> {
    @Builder.Default
    private int code = 1001;
    private String message;
    private T result;

}
