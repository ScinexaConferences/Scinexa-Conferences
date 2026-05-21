package com.scinexa.conferences.file.service;

import com.scinexa.conferences.file.dto.FileUploadResponseDto;
import com.scinexa.conferences.file.exception.FileStorageException;
import com.scinexa.conferences.file.util.FileValidationUtil;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@Service
public class S3Service {

    private final S3Client s3Client;
    private final FileValidationUtil fileValidationUtil;
    private final String bucketName;
    private final String region;

    public S3Service(
            S3Client s3Client,
            FileValidationUtil fileValidationUtil,
            @org.springframework.beans.factory.annotation.Value("${aws.bucket-name}") String bucketName,
            @org.springframework.beans.factory.annotation.Value("${aws.region}") String region
    ) {
        this.s3Client = s3Client;
        this.fileValidationUtil = fileValidationUtil;
        this.bucketName = bucketName;
        this.region = region;
    }

    public FileUploadResponseDto uploadFile(MultipartFile file, String category, Authentication authentication) {
        validateAuthenticatedUser(authentication);
        validateS3Configuration();

        String normalizedCategory = fileValidationUtil.validateCategory(category);
        if (fileValidationUtil.isCategoryAdminOnly(normalizedCategory) && !isAdmin(authentication)) {
            throw new AccessDeniedException("Only ADMIN users can upload certificate files");
        }

        fileValidationUtil.validateFile(file, normalizedCategory);

        String originalFileName = file.getOriginalFilename();
        String extension = fileValidationUtil.extractExtension(originalFileName);
        String generatedFileName = UUID.randomUUID() + "." + extension;
        String objectKey = normalizedCategory + "/" + generatedFileName;
        String contentType = file.getContentType();
        Instant uploadedAt = Instant.now();

        try {
            log.info("Uploading file '{}' to bucket '{}' with key '{}'", originalFileName, bucketName, objectKey);

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(contentType)
                    .contentLength(file.getSize())
                    .metadata(Map.of(
                            "original-file-name", originalFileName == null ? generatedFileName : originalFileName,
                            "uploaded-by", authentication.getName(),
                            "upload-category", normalizedCategory
                    ))
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

            return new FileUploadResponseDto(
                    objectKey,
                    generateFileUrl(objectKey),
                    contentType,
                    file.getSize(),
                    uploadedAt
            );
        } catch (S3Exception | SdkClientException exception) {
            log.error("AWS S3 upload failed for key '{}'", objectKey, exception);
            throw new FileStorageException(buildUploadErrorMessage(exception), exception);
        } catch (IOException exception) {
            log.error("Failed to read multipart file bytes for key '{}'", objectKey, exception);
            throw new FileStorageException("Failed to process the uploaded file", exception);
        }
    }

    public void deleteFile(String objectKey, Authentication authentication) {
        validateAuthenticatedUser(authentication);
        validateS3Configuration();
        if (!isAdmin(authentication) && !isOrganizer(authentication)) {
            throw new AccessDeniedException("Only ADMIN or ORGANIZER users can delete uploaded files");
        }

        String normalizedKey = fileValidationUtil.validateObjectKey(objectKey);

        try {
            log.info("Deleting S3 object '{}' from bucket '{}'", normalizedKey, bucketName);
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(normalizedKey)
                    .build());
        } catch (S3Exception | SdkClientException exception) {
            log.error("AWS S3 delete failed for key '{}'", normalizedKey, exception);
            throw new FileStorageException(buildDeleteErrorMessage(exception), exception);
        }
    }

    public String generateFileUrl(String objectKey) {
        validateS3Configuration();
        String normalizedKey = fileValidationUtil.validateObjectKey(objectKey);
        String fileUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileValidationUtil.encodeObjectKey(normalizedKey);
        log.debug("Generated S3 URL for key '{}'", normalizedKey);
        return fileUrl;
    }

    private void validateAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authenticated user is required for this operation");
        }
    }

    private void validateS3Configuration() {
        if (bucketName == null || bucketName.isBlank()) {
            throw new FileStorageException("AWS_BUCKET_NAME is not configured");
        }

        if (region == null || region.isBlank()) {
            throw new FileStorageException("AWS_REGION is not configured");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private boolean isOrganizer(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ORGANIZER".equals(authority.getAuthority()));
    }

    private String buildUploadErrorMessage(Exception exception) {
        return "Failed to upload file to AWS S3: " + extractAwsMessage(exception);
    }

    private String buildDeleteErrorMessage(Exception exception) {
        return "Failed to delete file from AWS S3: " + extractAwsMessage(exception);
    }

    private String extractAwsMessage(Exception exception) {
        if (exception instanceof S3Exception s3Exception) {
            String awsMessage = s3Exception.awsErrorDetails() != null
                    ? s3Exception.awsErrorDetails().errorMessage()
                    : null;

            if (awsMessage != null && !awsMessage.isBlank()) {
                return awsMessage;
            }
        }

        String message = exception.getMessage();
        return message == null || message.isBlank() ? "Unknown AWS error" : message;
    }
}
