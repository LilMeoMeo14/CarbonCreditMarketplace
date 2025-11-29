package nhom12.uth.ccm.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Builder;
import lombok.Data;

// dung de search va loc tin chi
@Data
@Builder
@Document(indexName = "listings")
public class ListingDocument {
    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String vehicleModel; // Tên xe (VinFast VF8) - Text để tìm gần đúng

    @Field(type = FieldType.Text, analyzer = "standard")
    private String sellerName; // Tên người bán

    @Field(type = FieldType.Double)
    private Double amount; // Số lượng (Dùng Double cho ES dễ xử lý range)

    @Field(type = FieldType.Double)
    private Double price; // Giá tiền

    @Field(type = FieldType.Keyword)
    private String type; // DIRECT_SALE / AUCTION (Keyword tìm chính xác)

    @Field(type = FieldType.Keyword)
    private String status; // ACTIVE

    @Field(type = FieldType.Date, format = {}, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'||yyyy-MM-dd'T'HH:mm:ss||yyyy-MM-dd")
    private LocalDateTime createdAt;
}
