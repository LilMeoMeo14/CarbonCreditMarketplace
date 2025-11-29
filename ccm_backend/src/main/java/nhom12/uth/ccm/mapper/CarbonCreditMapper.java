package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import nhom12.uth.ccm.dto.response.CarbonCreditResponse;
import nhom12.uth.ccm.model.CarbonCredit;

@Mapper(componentModel = "spring")
public interface CarbonCreditMapper {
    @Mapping(source = "request.requestId", target = "requestId")
    @Mapping(source = "user.userId", target = "ownerId")
    @Mapping(source = "user.email", target = "ownerEmail")
    CarbonCreditResponse toResponse(CarbonCredit credit);

}
