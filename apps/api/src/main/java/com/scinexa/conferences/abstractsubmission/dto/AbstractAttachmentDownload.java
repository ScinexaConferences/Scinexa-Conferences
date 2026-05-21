package com.scinexa.conferences.abstractsubmission.dto;

public record AbstractAttachmentDownload(
        String fileName,
        String fileType,
        byte[] content
) {
}
