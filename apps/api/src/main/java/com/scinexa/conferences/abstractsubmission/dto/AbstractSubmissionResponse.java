package com.scinexa.conferences.abstractsubmission.dto;

import java.time.Instant;

public record AbstractSubmissionResponse(
        String id,
        String referenceCode,
        String reviewStatus,
        String titlePrefix,
        String presentationType,
        String firstName,
        String lastName,
        String email,
        String phone,
        String organization,
        String department,
        String country,
        String abstractTitle,
        String sessionTrack,
        String abstractText,
        String fileName,
        String fileType,
        long fileSize,
        Instant createdAt
) {
}
