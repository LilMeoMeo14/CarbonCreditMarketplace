package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import nhom12.uth.ccm.dto.response.BidResponse;
import nhom12.uth.ccm.model.Bid;
import nhom12.uth.ccm.model.User;

@Mapper(componentModel = "spring")
public interface BidMapper {

    @Mapping(source = "listing.listingId", target = "listingId")
    @Mapping(source = "bidder.userId", target = "bidderId")
    @Mapping(source = "bidder", target = "bidderName", qualifiedByName = "getFullName")
    BidResponse toResponse(Bid bid);

    @Named("getFullName")
    default String getFullName(User user) {
        if (user == null)
            return "Unknown User";
        String first = user.getFirstName() == null ? "" : user.getFirstName();
        String last = user.getLastName() == null ? "" : user.getLastName();
        return (first + " " + last).trim();
    }

}