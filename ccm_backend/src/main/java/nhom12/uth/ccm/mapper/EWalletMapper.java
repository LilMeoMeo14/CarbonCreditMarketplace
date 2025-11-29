package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;

import nhom12.uth.ccm.dto.response.EWalletResponse;
import nhom12.uth.ccm.model.EWallet;

@Mapper(componentModel = "spring")
public interface EWalletMapper {
    EWalletResponse toResponse(EWallet wallet);
}
