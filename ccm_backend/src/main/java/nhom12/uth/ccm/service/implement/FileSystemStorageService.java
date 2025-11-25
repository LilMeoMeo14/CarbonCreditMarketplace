package nhom12.uth.ccm.service.implement;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import nhom12.uth.ccm.exception.AppException;
import nhom12.uth.ccm.exception.ErrorCode;
import nhom12.uth.ccm.service.IStorageService;

@Service
public class FileSystemStorageService implements IStorageService {

    @Value("${ccm.upload-dir}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct // chay ngay sau khi bean duoc tao
    @Override
    public void init() {
        try {
            this.rootLocation = Paths.get(uploadDir);
            Files.createDirectories(rootLocation);
        } catch (IOException ex) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        /*
         * Luồng hoạt động
         * 1. tạo file với uuid
         * 2. lưu file vào ổ cứng
         */

        try {
            if (file.isEmpty()) {
                throw new AppException(ErrorCode.FILE_NOT_FOUND);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = UUID.randomUUID().toString() + extension;

            // Luu file vao o cung

            Path destinationFile = this.rootLocation.resolve(
                    Paths.get(newFilename)).normalize().toAbsolutePath();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return newFilename;

        } catch (IOException ex) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new AppException(ErrorCode.FILE_NOT_FOUND);
            }
        } catch (MalformedURLException e) {
            throw new AppException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

}
