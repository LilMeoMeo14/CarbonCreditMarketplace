package nhom12.uth.ccm.scheduler;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.service.IListingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private static final Logger log = LoggerFactory.getLogger(AuctionScheduler.class);
    private final IListingService listingService;

    /**
     * Chạy định kỳ để quét các phiên đấu giá hết hạn.
     * fixedRate = 60000: Chạy mỗi 60 giây (1 phút).
     */
    @Scheduled(fixedRate = 60000)
    public void scanExpiredAuctions() {
        // log.info("Scanning for expired auctions..."); // debug
        try {
            // Gọi Service để xử lý các phiên hết hạn
            listingService.processExpiredAuctions();
        } catch (Exception e) {
            log.error("Error while processing expired auctions", e);
        }
    }
}