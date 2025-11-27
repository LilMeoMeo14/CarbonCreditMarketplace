package nhom12.uth.ccm.mapper;

import org.mapstruct.Mapper;

import nhom12.uth.ccm.dto.response.CarbonWalletResponse;
import nhom12.uth.ccm.model.CarbonWallet;

@Mapper(componentModel = "spring")
public interface CarbonWalletMapper {
    CarbonWalletResponse toResponse(CarbonWallet carbonWallet);
    
}

