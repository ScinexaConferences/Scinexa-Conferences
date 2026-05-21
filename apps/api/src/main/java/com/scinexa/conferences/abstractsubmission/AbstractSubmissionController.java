package com.scinexa.conferences.abstractsubmission;

import com.scinexa.conferences.abstractsubmission.dto.AbstractAttachmentDownload;
import com.scinexa.conferences.abstractsubmission.dto.AbstractSubmissionRequest;
import com.scinexa.conferences.abstractsubmission.dto.AbstractSubmissionResponse;
import com.scinexa.conferences.abstractsubmission.service.AbstractSubmissionService;
import com.scinexa.conferences.common.api.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/abstract-submissions")
@RequiredArgsConstructor
public class AbstractSubmissionController {

    private final AbstractSubmissionService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AbstractSubmissionResponse>> createSubmission(
            @Valid @ModelAttribute AbstractSubmissionRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Abstract submitted successfully", service.create(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AbstractSubmissionResponse>>> listSubmissions() {
        return ResponseEntity.ok(ApiResponse.success("Abstract submissions fetched", service.listAll()));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ByteArrayResource> downloadAttachment(@PathVariable String id) {
        AbstractAttachmentDownload attachment = service.downloadAttachment(id);
        String safeFileName = attachment.fileName().replace("\"", "");
        MediaType mediaType = attachment.fileType() == null || attachment.fileType().isBlank()
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(attachment.fileType());

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(attachment.content().length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFileName + "\"")
                .body(new ByteArrayResource(attachment.content()));
    }
}
