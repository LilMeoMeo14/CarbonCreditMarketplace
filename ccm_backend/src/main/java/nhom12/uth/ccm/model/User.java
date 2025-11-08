package nhom12.uth.ccm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="users")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id",updatable = false,nullable = false,columnDefinition = "VARCHAR(36)")
    private String user_id;

    @Column(name = "email", length = 255, unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", length = 255, nullable = false)
    private String password_hash;

    @Column(name = "full_name", length = 100)
    private String full_name;

    @Column(name = "phone_number", length = 20, unique = true)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole userRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @ColumnDefault("'ACTIVE'")
    private UserStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // one to many
    // one user -> many EV profiles
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<EVProfile> evProfiles = new ArrayList<>();

    // one to many
    // one user -> many CarbonCreditRequest
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<CarbonCreditRequest> creditRequests = new ArrayList<>();

    // one to one
    // one user -> one Carbon wallet
    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private CarbonWallet carbonWallet;
    // one to one
    // one user -> one EWallet
    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private EWallet eWallet;
    /**
     * Quan hệ Một-Nhiều (One-to-Many) với Listing.
     * Một User có thể đăng nhiều Listing (bài đăng bán).
     * 'mappedBy = "user"': Giả định class Listing có trường 'private User user;' (hoặc seller).
     * CascadeType.ALL: Xóa User, xóa luôn các listing của họ.
     */
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Listing> listings = new ArrayList<>();
    /**
     * Lịch sử các giao dịch MUA của User.
     * 'mappedBy = "buyer"': Giả định class Transaction có trường 'private User buyer;'.
     * KHÔNG DÙNG CASCADE: Khi xóa User, ta không muốn xóa lịch sử giao dịch.
     */
    @OneToMany(
            mappedBy = "buyer",
            fetch = FetchType.LAZY
    )
    private List<Transaction> purchasedTransactions = new ArrayList<>();
    @OneToMany(
            mappedBy = "seller",
            fetch = FetchType.LAZY
    )
    private List<Transaction> saleTransactions = new ArrayList<>();
    @OneToMany(
            mappedBy = "bidder",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Bid> bids = new ArrayList<>();

    @OneToMany(
            mappedBy = "owner",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Certificate> certificates = new ArrayList<>();

    // full parameter
    public User(String email, String password_hash, String full_name, String phoneNumber, UserRole userRole, UserStatus status) {
        this.email = email;
        this.password_hash = password_hash;
        this.full_name = full_name;
        this.phoneNumber = phoneNumber;
        this.userRole = userRole;
        this.status = status;
    }
}
