package nhom12.uth.ccm.service.implement;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.model.CarbonCredit;
import nhom12.uth.ccm.repository.ICarbonCreditRepository;
import nhom12.uth.ccm.service.IReportService;

@Service
@RequiredArgsConstructor
public class ReportService implements IReportService {

    private final ICarbonCreditRepository creditRepository;

    @Override
    public ByteArrayInputStream exportIssuanceReport(String cvaId) {
        // lay du lieu tu db
        List<CarbonCredit> credits = creditRepository.findByRequest_Verifier_UserId(cvaId);

        // chuan bi luong ghi
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PrintWriter writer = new PrintWriter(out)) {

            // 3. Viết dòng Tiêu đề (Header)
            writer.println("Credit ID,Serial Number,Owner Email,Amount,Date,Verifier");

            // 4. Viết từng dòng dữ liệu
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            for (CarbonCredit credit : credits) {
                String line = String.format("%d,%s,%s,%s,%s,%s",
                        credit.getCreditId(),
                        "",
                        credit.getUser().getEmail(),
                        credit.getAmount(),
                        credit.getIssuedDate().format(formatter),
                        credit.getRequest().getVerifier().getEmail() // Lấy email người duyệt
                );
                writer.println(line);
            }

            writer.flush();

        } catch (Exception e) {
            throw new RuntimeException("Fail to export data to CSV file: " + e.getMessage());
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

}
