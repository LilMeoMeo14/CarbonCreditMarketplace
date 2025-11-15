package nhom12.uth.ccm.mapper;

import nhom12.uth.ccm.dto.request.CreateUserRequestDTO;
import nhom12.uth.ccm.dto.request.UpdateUserRequestDTO;
import nhom12.uth.ccm.dto.respone.UserResponeDTO;
import nhom12.uth.ccm.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "evProfiles", ignore = true)
    @Mapping(target = "creditRequests", ignore = true)
    @Mapping(target = "carbonWallet", ignore = true)
    @Mapping(target = "EWallet", ignore = true)
    @Mapping(target = "listings", ignore = true)
    @Mapping(target = "purchasedTransactions", ignore = true)
    @Mapping(target = "saleTransactions", ignore = true)
    @Mapping(target = "bids", ignore = true)
    @Mapping(target = "certificates", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(source = "role", target = "userRole")
    @Mapping(source = "password", target = "passwordHash")
    User toUser(CreateUserRequestDTO createUserRequestDTO);

    @Mapping(target = "email", ignore = true)
    @Mapping(target = "phoneNumber", ignore = true)
    @Mapping(source = "role", target = "userRole")
    @Mapping(target = "evProfiles", ignore = true)
    @Mapping(target = "creditRequests", ignore = true)
    @Mapping(target = "carbonWallet", ignore = true)
    @Mapping(target = "EWallet", ignore = true)
    @Mapping(target = "listings", ignore = true)
    @Mapping(target = "purchasedTransactions", ignore = true)
    @Mapping(target = "saleTransactions", ignore = true)
    @Mapping(target = "bids", ignore = true)
    @Mapping(target = "certificates", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "userId", ignore = true)
    void updateUser(@MappingTarget User user, UpdateUserRequestDTO updateUserRequestDTO);

    @Mapping(source = "userRole", target = "role")
    @Mapping(source = "userId", target = "userId")
    UserResponeDTO toUserResponeDTO(User user);
}