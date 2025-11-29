package nhom12.uth.ccm.service;

import java.io.ByteArrayInputStream;

public interface IReportService {
    // xuất báo cáo csv
    public ByteArrayInputStream exportIssuanceReport(String cvaId);
}
