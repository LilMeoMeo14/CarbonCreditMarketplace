package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nhom12.uth.ccm.model.enums.BidStatus;

import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bid")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id", updatable = false, nullable = false)
    private Long bidId;

    /**
     * Quan hệ Many-to-One với Listing.
     * Thay vì trỏ vào Auction, ta trỏ thẳng vào Listing.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing; // <-- SỬA: Dùng Listing

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    private User bidder; // (Đổi tên buyer_id -> bidder_id cho chuẩn thuật ngữ đấu giá)

    @Column(name = "amount", precision = 19, scale = 2, nullable = false)
    private BigDecimal amount; // Giá đặt

    @CreationTimestamp
    @Column(name = "bid_time", updatable = false, nullable = false)
    private LocalDateTime bidTime;

    // (Tùy chọn) Trạng thái bid: ACTIVE, CANCELLED, WON...
    // Nếu bạn muốn quản lý lịch sử chi tiết
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private BidStatus status = BidStatus.ACTIVE;
}