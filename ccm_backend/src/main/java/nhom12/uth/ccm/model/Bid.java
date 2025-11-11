package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import nhom12.uth.ccm.model.enums.BidStatus;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bid")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id", updatable = false, nullable = false)
    private Long bidId;

    /**
     * Nhiều lượt đặt giá thuộc về một Auction
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    /**
     * Người đặt giá (bidder)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(name = "bid_price_per_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal bidPricePerKg;

    @CreationTimestamp
    @Column(name = "bid_time", updatable = false, nullable = false)
    private LocalDateTime bidTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @ColumnDefault("'ACTIVE'")
    private BidStatus status;

    // -----------------------------------------------------------------
    // Constructor tùy chỉnh (không bao gồm ID và bidTime)
    // -----------------------------------------------------------------
    public Bid(Auction auction, User buyer, BigDecimal bidPricePerKg, BidStatus status) {
        this.auction = auction;
        this.buyer = buyer;
        this.bidPricePerKg = bidPricePerKg;
        this.status = status;
    }
}
