package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import nhom12.uth.ccm.dto.response.PaymentTransactionResponse;
import nhom12.uth.ccm.model.PaymentTransaction;

@Mapper(componentModel = "spring")
public interface PaymentTransactionMapper {
    @Mapping(source = "EWallet.walletId", target = "walletId")
    @Mapping(source = "type", target = "type") // Map enum PaymentType (đảm bảo tên field khớp nhau)
    PaymentTransactionResponse toResponse(PaymentTransaction transaction);
}