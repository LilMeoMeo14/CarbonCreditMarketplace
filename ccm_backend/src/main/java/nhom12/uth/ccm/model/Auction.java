package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import nhom12.uth.ccm.model.enums.AuctionStatus;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_id", updatable = false, nullable = false)
    private Long auctionId;

    /**
     * Quan hệ 1-1 với Listing.
     * Một Auction chỉ thuộc về một Listing duy nhất.
     * Một Listing chỉ có tối đa một Auction.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false, unique = true)
    private Listing listing;

    @Column(name = "start_price_per_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal startPricePerKg;

    @Column(name = "current_price_per_kg", precision = 10, scale = 2)
    private BigDecimal currentPricePerKg;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @ColumnDefault("'UPCOMING'")
    private AuctionStatus status;

    /**
     * Người chiến thắng phiên đấu giá (nếu có).
     * winner_id là khóa ngoại trỏ đến USER.user_id
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private User winner;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -----------------------------------------------------------------
    // Constructor tùy chỉnh (không bao gồm ID, createdAt, updatedAt)
    // -----------------------------------------------------------------
    public Auction(Listing listing, BigDecimal startPricePerKg, BigDecimal currentPricePerKg,
                   LocalDateTime startTime, LocalDateTime endTime, AuctionStatus status, User winner) {
        this.listing = listing;
        this.startPricePerKg = startPricePerKg;
        this.currentPricePerKg = currentPricePerKg;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.winner = winner;
    }
}
