package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import nhom12.uth.ccm.dto.request.ListingRequest;
import nhom12.uth.ccm.dto.response.ListingResponse;

import nhom12.uth.ccm.model.Listing;
import nhom12.uth.ccm.model.User;

@Mapper(componentModel = "spring")
public interface ListingMapper {

    @Mapping(target = "listingId", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "winner", ignore = true)
    @Mapping(target = "currentHighestBid", ignore = true)
    Listing toListing(ListingRequest listingRequest);

    @Mapping(source = "seller.userId", target = "sellerId")

    @Mapping(source = "seller", target = "sellerName", qualifiedByName = "getFullName")

    @Mapping(source = "seller", target = "vehicleModel", qualifiedByName = "getVehicleModel")

    @Mapping(source = "seller", target = "licensePlate", qualifiedByName = "getLicensePlate")
    ListingResponse toResponse(Listing listing);

    @Named("getFullName")
    default String getFullName(User seller) {
        if (seller == null)
            return "Unknown Seller";
        String first = seller.getFirstName() == null ? "" : seller.getFirstName();
        String last = seller.getLastName() == null ? "" : seller.getLastName();
        return (first + " " + last).trim();
    }

    @Named("getVehicleModel")
    default String getVehicleModel(User seller) {
        if (seller == null || seller.getEvProfiles() == null || seller.getEvProfiles().isEmpty()) {
            return "Unknown Vehicle";
        }
        // Lay xe dau tien dai dien
        return seller.getEvProfiles().get(0).getVehicleModel();
    }

    @Named("getLicensePlate")
    default String getLicensePlate(User seller) {
        if (seller == null || seller.getEvProfiles() == null || seller.getEvProfiles().isEmpty()) {
            return "N/A";
        }
        return seller.getEvProfiles().get(0).getLicensePlate();
    }

}
