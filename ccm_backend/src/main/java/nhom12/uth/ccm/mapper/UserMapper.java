package nhom12.uth.ccm.mapper;

import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring") // khai bao de map struct biet va generate de su dung trong spring// dependency injection
public interface UserMapper {

    //@Mapping(target="password, ignore = true) // khong mapping field password
    @Mapping(source = "role" ,target = "userRole")
    @Mapping(source = "password",target = "passwordHash")
    User toUser(CreateUserRequestDTO createUserRequestDTO);

    @Mapping(source = "role" ,target = "userRole")
    @Mapping(source = "password",target = "passwordHash")
    void updateUser(@MappingTarget User user, UpdateUserRequestDTO updateUserRequestDTO );

    UserResponeDTO toUserResponeDTO(User user);
}
