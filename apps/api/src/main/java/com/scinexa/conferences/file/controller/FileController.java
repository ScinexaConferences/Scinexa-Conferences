package com.scinexa.conferences.file.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.file.dto.FileUploadResponseDto;
import com.scinexa.conferences.file.service.S3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Files", description = "AWS S3 file upload and file management APIs.")
@SecurityRequirement(name = "bearerAuth")
public class FileController {

    private final S3Service s3Service;

    @PostMapping("/upload")
    @Operation(
            summary = "Upload a file to AWS S3",
            description = "Uploads a validated multipart file into an S3 folder category such as banners, speakers, certificates, abstracts, sponsors, profiles, or brochures."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "File uploaded successfully",
                    content = @Content(schema = @Schema(implementation = FileUploadResponseDto.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file or invalid upload category"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden for the requested category"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "502", description = "AWS S3 upload failure")
    })
    public ResponseEntity<ApiResponse<FileUploadResponseDto>> uploadFile(
            @Parameter(description = "File to upload", required = true) @RequestParam("file") MultipartFile file,
            @Parameter(description = "Upload category folder: banners, speakers, certificates, abstracts, sponsors, profiles, brochures", required = true)
            @RequestParam("category") @NotBlank String category,
            Authentication authentication
    ) {
        FileUploadResponseDto response = s3Service.uploadFile(file, category, authentication);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete a file from AWS S3", description = "Deletes an object from the configured S3 bucket using its object key.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid object key"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not allowed to delete files"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "502", description = "AWS S3 delete failure")
    })
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteFile(
            @Parameter(description = "S3 object key such as speakers/uuid-file.jpg", required = true)
            @RequestParam("key") @NotBlank String objectKey,
            Authentication authentication
    ) {
        s3Service.deleteFile(objectKey, authentication);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", Map.of("key", objectKey)));
    }

    @GetMapping("/url")
    @Operation(summary = "Generate an S3 file URL", description = "Returns the direct S3 URL for a validated object key.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File URL generated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid object key")
    })
    public ResponseEntity<ApiResponse<Map<String, String>>> generateFileUrl(
            @Parameter(description = "S3 object key such as brochures/uuid-file.pdf", required = true)
            @RequestParam("key") @NotBlank String objectKey
    ) {
        String fileUrl = s3Service.generateFileUrl(objectKey);
        return ResponseEntity.ok(ApiResponse.success("File URL generated successfully", Map.of("fileUrl", fileUrl, "key", objectKey)));
    }
}
