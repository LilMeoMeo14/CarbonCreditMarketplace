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

    // chuyen tu dto sang entity
    @Mapping(target = "listingId", ignore = true)
    @Mapping(target = "seller", ignore = true) // Seller sẽ được set trong Service (lấy từ token)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Listing toListing(ListingRequest listingRequest);

    // chuyen tu entity sang dto
    @Mapping(source = "seller.userId", target = "sellerId")
    @Mapping(source = "seller", target = "sellerName", qualifiedByName = "getFullName")
    ListingResponse tResponse(Listing listing);

    // ghep first & last thanh full name
    @Named("getFullName")
    default String getFullName(User seller) {
        if (seller == null) {
            return "Unknown Seller";
        }
        // Xử lý null safe để tránh hiện chữ "null"
        String first = seller.getFirstName() == null ? "" : seller.getFirstName();
        String last = seller.getLastName() == null ? "" : seller.getLastName();

        return (first + " " + last).trim();
    }
}