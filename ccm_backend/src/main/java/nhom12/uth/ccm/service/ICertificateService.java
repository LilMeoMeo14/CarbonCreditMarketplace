package nhom12.uth.ccm.service;

import java.util.List;

import nhom12.uth.ccm.dto.request.RetireRequest;
import nhom12.uth.ccm.dto.response.CertificateResponse;

public interface ICertificateService {

    // huy chung chi
    public CertificateResponse retireCredits(RetireRequest retireRequest, String userId);

    // Lay tat ca cac certificate hien co

    public List<CertificateResponse> getMyCertificate(String userId);
}