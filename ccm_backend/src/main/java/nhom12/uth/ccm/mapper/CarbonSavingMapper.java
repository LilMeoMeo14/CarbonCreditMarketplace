package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import nhom12.uth.ccm.dto.response.CarbonSavingResponse;
import nhom12.uth.ccm.model.CarbonSaving;

@Mapper(componentModel = "spring")
public interface CarbonSavingMapper {

    @Mapping(source = "evProfile.evProfileId", target = "evProfileId")
    @Mapping(source = "evProfile.licensePlate", target = "licensePlate")
    @Mapping(source = "evProfile.vehicleModel", target = "vehicleModel")
    CarbonSavingResponse toResponse(CarbonSaving carbonSaving);

}
