package com.scinexa.conferences.file.util;

import com.scinexa.conferences.file.exception.InvalidFileException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileValidationUtil {

    private static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "banners",
            "speakers",
            "certificates",
            "abstracts",
            "sponsors",
            "profiles",
            "brochures"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "pdf", "ppt", "pptx");

    private static final Map<String, Set<String>> ALLOWED_CONTENT_TYPES = Map.of(
            "jpg", Set.of("image/jpeg"),
            "jpeg", Set.of("image/jpeg"),
            "png", Set.of("image/png"),
            "pdf", Set.of("application/pdf"),
            "ppt", Set.of("application/vnd.ms-powerpoint"),
            "pptx", Set.of("application/vnd.openxmlformats-officedocument.presentationml.presentation")
    );

    private final DataSize maxFileSize;

    public FileValidationUtil(@Value("${spring.servlet.multipart.max-file-size:50MB}") DataSize maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public void validateFile(MultipartFile file, String category) {
        validateCategory(category);

        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Please provide a non-empty file");
        }

        if (file.getSize() > maxFileSize.toBytes()) {
            throw new InvalidFileException("Uploaded file exceeds the configured 50MB limit");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        if (originalFileName.isBlank()) {
            throw new InvalidFileException("Original file name is missing");
        }

        if (originalFileName.contains("..") || originalFileName.contains("/") || originalFileName.contains("\\")) {
            throw new InvalidFileException("Unsafe file name detected");
        }

        String extension = extractExtension(originalFileName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new InvalidFileException("Invalid file type. Allowed types: jpg, jpeg, png, pdf, ppt, pptx");
        }

        String contentType = normalizeContentType(file.getContentType());
        if (!ALLOWED_CONTENT_TYPES.get(extension).contains(contentType)) {
            throw new InvalidFileException("Invalid content type for the uploaded file");
        }
    }

    public String validateCategory(String category) {
        String normalizedCategory = normalizeLowercaseValue(category);
        if (!ALLOWED_CATEGORIES.contains(normalizedCategory)) {
            throw new InvalidFileException("Invalid upload category");
        }
        return normalizedCategory;
    }

    public String validateObjectKey(String objectKey) {
        String normalizedKey = normalizeValue(objectKey);
        if (normalizedKey.contains("..") || normalizedKey.contains("\\") || normalizedKey.startsWith("/")) {
            throw new InvalidFileException("Unsafe object key detected");
        }

        String[] parts = normalizedKey.split("/", 2);
        if (parts.length != 2 || !ALLOWED_CATEGORIES.contains(parts[0].toLowerCase(Locale.ROOT)) || parts[1].isBlank()) {
            throw new InvalidFileException("Object key must start with a valid category folder");
        }

        return normalizedKey;
    }

    public String extractExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex < 0 || lastDotIndex == fileName.length() - 1) {
            throw new InvalidFileException("File extension is required");
        }

        return fileName.substring(lastDotIndex + 1).toLowerCase(Locale.ROOT);
    }

    public String encodeObjectKey(String objectKey) {
        return URLEncoder.encode(objectKey, StandardCharsets.UTF_8).replace("+", "%20").replace("%2F", "/");
    }

    public boolean isCategoryAdminOnly(String category) {
        return "certificates".equals(validateCategory(category));
    }

    private String normalizeContentType(String contentType) {
        return normalizeLowercaseValue(contentType);
    }

    private String normalizeValue(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidFileException("Required value is missing");
        }

        return value.trim();
    }

    private String normalizeLowercaseValue(String value) {
        return normalizeValue(value).toLowerCase(Locale.ROOT);
    }
}
