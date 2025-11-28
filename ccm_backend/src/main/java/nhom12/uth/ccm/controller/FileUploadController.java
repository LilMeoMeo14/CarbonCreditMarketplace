package nhom12.uth.ccm.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import nhom12.uth.ccm.dto.request.ApiRespone;
import nhom12.uth.ccm.service.IStorageService;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileUploadController {
    private final IStorageService storageService;

    @PostMapping("/upload")
    public ApiRespone<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String storedFilename = storageService.storeFile(file);
        return ApiRespone.<String>builder()
                .result(storedFilename)
                .build();
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);

        return ResponseEntity.ok()

                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(file);
    }
}