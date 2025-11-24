package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import nhom12.uth.ccm.dto.response.CreditRequestResponse;
import nhom12.uth.ccm.model.CarbonCreditRequest;

@Mapper(componentModel = "spring")
public interface CarbonCreditRequestMapper {

    // lay id xe tu object EvProfile tu request
    @Mapping(source = "evProfile.evProfileId", target = "evProfileId")

    // lay bien so xe
    @Mapping(source = "evProfile.licensePlate", target = "licensePlate")
    CreditRequestResponse toResponse(CarbonCreditRequest carbonCreditRequest);

}