package nhom12.uth.ccm.service;

import java.util.List;

import nhom12.uth.ccm.dto.request.CarbonSavingRequest;
import nhom12.uth.ccm.dto.response.CarbonSavingResponse;

public interface ICarbonSavingService {
        /**
         * Tạo một bản ghi "tiết kiệm carbon" mới (từ km đã đi).
         * BẮT BUỘC xe này phải thuộc user đang đăng nhập.
         *
         * @param evProfileId ID của xe (từ URL)
         * @param dto         Dữ liệu (distanceKm, recordedDate)
         * @param userId      ID của user (từ Token)
         * @return DTO của bản ghi đã được tạo (đã tính CO2)
         */
        CarbonSavingResponse createCarbonSaving(Long evProfileId,
                        CarbonSavingRequest carbonSavingRequest,
                        String userId);

        /**
         * Lấy TẤT CẢ lịch sử "tiết kiệm carbon" của MỘT chiếc xe.
         * BẮT BUỘC xe này phải thuộc user đang đăng nhập.
         *
         * @param evProfileId ID của xe (từ URL)
         * @param userId      ID của user (từ Token)
         * @return Danh sách DTO của các bản ghi
         */
        List<CarbonSavingResponse> getCarbonSavingsForProfile(Long evProfileId,
                        String userId);
}
