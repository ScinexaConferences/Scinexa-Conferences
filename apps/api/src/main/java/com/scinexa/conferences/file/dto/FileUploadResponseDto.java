package com.scinexa.conferences.file.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "Metadata returned after a successful S3 upload.")
public record FileUploadResponseDto(
        @Schema(example = "banners/6c1795c0-14c8-4fca-b6c9-a3d620c90911.png") String fileName,
        @Schema(example = "https://scinexa-conferences-storage.s3.ap-south-1.amazonaws.com/banners/6c1795c0-14c8-4fca-b6c9-a3d620c90911.png") String fileUrl,
        @Schema(example = "image/png") String fileType,
        @Schema(example = "245901") long size,
        @Schema(example = "2026-05-20T22:10:00Z") Instant uploadedAt
) {
}
