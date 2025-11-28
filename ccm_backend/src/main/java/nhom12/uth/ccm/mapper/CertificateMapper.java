package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import nhom12.uth.ccm.dto.response.CertificateResponse;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.model.Certificate;
import nhom12.uth.ccm.model.User;

@Mapper(componentModel = "spring")
public interface CertificateMapper {
    // Lấy tên chủ sở hữu để hiển thị lên bằng khen
    @Mapping(source = "user", target = "ownerName", qualifiedByName = "getFullName")
    CertificateResponse toResponse(Certificate certificate);

    @Named("getFullName")
    default String getFullName(User user) {
        if (user == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        String first = user.getFirstName() == null ? "" : user.getFirstName();
        String last = user.getLastName() == null ? "" : user.getLastName();
        return (first + " " + last).trim();
    }
}