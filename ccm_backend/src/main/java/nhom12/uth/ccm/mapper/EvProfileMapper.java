package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import nhom12.uth.ccm.dto.request.EvProfileRequest;
import nhom12.uth.ccm.dto.response.EvProfileResponse;
import nhom12.uth.ccm.model.EVProfile;

@Mapper(componentModel = "spring")
public interface EvProfileMapper {

    @Mapping(target = "evProfileId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "verificationStatus", ignore = true)
    @Mapping(target = "carbonSavings", ignore = true)
    @Mapping(target = "creditRequests", ignore = true)
    // chuyen tu dto sang entity
    EVProfile toEvProfile(EvProfileRequest evProfileRequest);

    // chuyen tu entity sang dto
    EvProfileResponse toEvProfileResponse(EVProfile evProfile);

    @Mapping(target = "evProfileId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "verificationStatus", ignore = true)
    @Mapping(target = "carbonSavings", ignore = true)
    @Mapping(target = "creditRequests", ignore = true)
    void updateEvProfile(@MappingTarget EVProfile evProfile, EvProfileRequest evProfileRequest);
}
