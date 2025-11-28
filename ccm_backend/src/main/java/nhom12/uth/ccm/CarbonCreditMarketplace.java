package nhom12.uth.ccm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CarbonCreditMarketplace {
    public static void main(String[] args) {
        SpringApplication.run(CarbonCreditMarketplace.class, args);
    }
}