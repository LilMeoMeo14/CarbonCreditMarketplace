package nhom12.uth.ccm.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.dto.request.BidRequest;
import nhom12.uth.ccm.dto.request.ListingRequest;
import nhom12.uth.ccm.dto.response.BidResponse;
import nhom12.uth.ccm.dto.response.ListingResponse;
import nhom12.uth.ccm.repository.IUserRepository;
import nhom12.uth.ccm.service.IListingService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/listings")
public class ListingController extends BaseController {
    private final IListingService listingService;
    private final IUserRepository userRepository;

    // khoa so du trong vi tao listing
    @PostMapping
    public ApiRespone<ListingResponse> createListing(@RequestBody @Valid ListingRequest listingRequest) {

        String userId = getAuthenticatedUserId();

        ListingResponse listingResponse = listingService.createListing(listingRequest, userId);

        return ApiRespone.<ListingResponse>builder()
                .result(listingResponse)
                .build();
    }

    // xem cac listing dang active tren market

    @GetMapping("/active")
    public ApiRespone<List<ListingResponse>> getActiveListing() {
        List<ListingResponse> listingResponses = listingService.getActiveListings();

        return ApiRespone.<List<ListingResponse>>builder()
                .result(listingResponses)
                .build();
    }

    // xem cac bai dang cua minh

    @GetMapping("/my-listings")
    public ApiRespone<List<ListingResponse>> getMyListing() {

        String userId = getAuthenticatedUserId();

        List<ListingResponse> myListingResponses = listingService.getMyListings(userId);

        return ApiRespone.<List<ListingResponse>>builder()
                .result(myListingResponses)
                .build();
    }

    // huy bai bang ban

    @PostMapping("/{listingId}/cancel")
    public ApiRespone<String> cancelListing(@PathVariable Long listingId) {
        String userId = getAuthenticatedUserId();

        listingService.cancelListing(listingId, userId);

        return ApiRespone.<String>builder()
                .result("Listing canceled successfully")
                .build();
    }

    /* Dau gia */

    @PostMapping("/{listingId}/bid")
    public ApiRespone<BidResponse> placeBid(
            @PathVariable Long listingId,
            @RequestBody @Valid BidRequest bidRequest) {

        String userId = getAuthenticatedUserId();

        // Gọi Service xử lý logic đấu giá (Validate, Khóa tiền, Lưu Bid)
        BidResponse bidResponse = listingService.placeBid(listingId, bidRequest.getAmount(), userId);

        return ApiRespone.<BidResponse>builder()
                .result(bidResponse)
                .build();
    }

}