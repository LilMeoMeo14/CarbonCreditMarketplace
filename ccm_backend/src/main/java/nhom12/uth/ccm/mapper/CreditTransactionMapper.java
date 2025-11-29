package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import nhom12.uth.ccm.dto.response.CreditTransactionResponse;
import nhom12.uth.ccm.model.CreditTransaction;
import nhom12.uth.ccm.model.User;

@Mapper(componentModel = "spring")
public interface CreditTransactionMapper {
    @Mapping(source = "listing.listingId", target = "listingId")
    @Mapping(source = "seller.userId", target = "sellerId")
    @Mapping(source = "seller", target = "sellerName", qualifiedByName = "getFullName")
    @Mapping(source = "buyer.userId", target = "buyerId")
    @Mapping(source = "buyer", target = "buyerName", qualifiedByName = "getFullName")
    CreditTransactionResponse toResponse(CreditTransaction transaction);

    @Named("getFullName")
    default String getFullName(User user) {
        if (user == null)
            return "Unknown User";
        String first = user.getFirstName() == null ? "" : user.getFirstName();
        String last = user.getLastName() == null ? "" : user.getLastName();
        return (first + " " + last).trim();
    }

}
