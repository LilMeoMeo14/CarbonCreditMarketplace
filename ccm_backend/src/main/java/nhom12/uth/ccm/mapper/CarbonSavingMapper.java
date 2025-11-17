package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;

import nhom12.uth.ccm.dto.response.CarbonSavingResponse;
import nhom12.uth.ccm.model.CarbonSaving;

@Mapper(componentModel = "spring")
public interface CarbonSavingMapper {
    CarbonSavingResponse toResponse(CarbonSaving carbonSaving);
}
