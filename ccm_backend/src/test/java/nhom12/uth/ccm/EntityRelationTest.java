package nhom12.uth.ccm;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import nhom12.uth.ccm.model.CarbonCreditRequest;
import nhom12.uth.ccm.model.CarbonWallet;
import nhom12.uth.ccm.model.EVProfile;
import nhom12.uth.ccm.model.User;
import nhom12.uth.ccm.model.enums.RequestStatus;
import nhom12.uth.ccm.model.enums.UserRole;
import nhom12.uth.ccm.model.enums.UserStatus;
import nhom12.uth.ccm.model.enums.VerificationStatus;
import nhom12.uth.ccm.repository.CarbonCreditRequestRepository;
import nhom12.uth.ccm.repository.CarbonWalletRepository;
import nhom12.uth.ccm.repository.EVProfileRepository;
import nhom12.uth.ccm.repository.UserRepository;

/**
 * Test quan hệ giữa các entity: User, EVProfile, CarbonCreditRequest, CarbonWallet
 * - Dùng H2 database dạng file → lưu ở: target/h2db/testdb.mv.db
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@Transactional
public class EntityRelationTest {

    @Autowired private UserRepository userRepository;
    @Autowired private EVProfileRepository evProfileRepository;
    @Autowired private CarbonCreditRequestRepository creditRequestRepository;
    @Autowired private CarbonWalletRepository walletRepository;

    @BeforeAll
    static void cleanupOldDatabase() {
        Path dbDir = Paths.get("target/h2db");
        if (Files.exists(dbDir)) {
            try {
                Files.walk(dbDir)
                        .sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try { path.toFile().delete(); } catch (Exception ignored) {}
                        });
                System.out.println("Đã dọn sạch DB cũ: " + dbDir.toAbsolutePath());
            } catch (IOException e) {
                System.err.println("Không thể xóa DB cũ: " + e.getMessage());
            }
        }
    }

    @Test
    void testSaveAndFind_CreditRequestAndWallet() {
        // 1. Tạo User
        User user = new User();
        user.setFull_name("Lê Minh Liêm");
        user.setEmail("liemliem910@gmail.com");
        user.setPassword_hash("123456");
        user.setUserRole(UserRole.EV_OWNER);
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        // 2. Tạo EVProfile
        EVProfile ev = new EVProfile();
        ev.setLicensePlate("EV-001");
        ev.setVehicleModel("Tesla Model Y");
        ev.setVerificationStatus(VerificationStatus.VERIFIED);
        ev.setUser(user);
        ev = evProfileRepository.save(ev);

        // 3. Tạo Credit Request
        CarbonCreditRequest request = new CarbonCreditRequest();
        request.setUser(user);
        request.setEvProfile(ev);
        request.setCo2AmountKg(BigDecimal.valueOf(123.45));
        request.setStatus(RequestStatus.PENDING);
        request = creditRequestRepository.save(request);

        // 4. Tạo Wallet
        CarbonWallet wallet = new CarbonWallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.valueOf(150.00));
        wallet = walletRepository.save(wallet);

        // 5. Truy vấn lại
        var foundRequest = creditRequestRepository.findById(request.getRequestId()).orElseThrow();
        var foundWallet = walletRepository.findById(wallet.getWalletId()).orElseThrow();

        // 6. Kiểm tra
        assertThat(foundRequest.getUser().getUser_id()).isEqualTo(user.getUser_id());
        assertThat(foundRequest.getEvProfile().getEvProfileId()).isEqualTo(ev.getEvProfileId());
        assertThat(foundWallet.getUser().getEmail()).isEqualTo("liemliem910@gmail.com");

        System.out.println("Test quan hệ Entity thành công!");
    }
}