package nhom12.uth.ccm.service;

import java.nio.file.Path;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface IStorageService {
    void init();

    String storeFile(MultipartFile file);

    Resource loadAsResource(String filename);

    Path load(String filename);
}
