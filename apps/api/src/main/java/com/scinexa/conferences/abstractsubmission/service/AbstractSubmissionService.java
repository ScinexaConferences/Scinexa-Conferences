package com.scinexa.conferences.abstractsubmission.service;

import com.scinexa.conferences.abstractsubmission.dto.AbstractAttachmentDownload;
import com.scinexa.conferences.abstractsubmission.dto.AbstractSubmissionRequest;
import com.scinexa.conferences.abstractsubmission.dto.AbstractSubmissionResponse;
import com.scinexa.conferences.abstractsubmission.entity.AbstractSubmission;
import com.scinexa.conferences.abstractsubmission.repository.AbstractSubmissionRepository;
import com.scinexa.conferences.common.exception.ResourceNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AbstractSubmissionService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx");
    private static final Map<String, Set<String>> ALLOWED_CONTENT_TYPES = Map.of(
            "pdf", Set.of("application/pdf"),
            "doc", Set.of("application/msword", "application/octet-stream"),
            "docx", Set.of(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/zip",
                    "application/octet-stream"
            )
    );

    private final AbstractSubmissionRepository repository;

    public AbstractSubmissionResponse create(AbstractSubmissionRequest request) {
        MultipartFile file = request.getFile();
        validateFile(file);

        String abstractText = normalizeRequiredText(request.getAbstractText());
        if (countWords(abstractText) > 300) {
            throw new IllegalArgumentException("Abstract text must stay within 300 words.");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "abstract-upload" : file.getOriginalFilename());
        String contentType = file.getContentType() == null || file.getContentType().isBlank()
                ? "application/octet-stream"
                : file.getContentType();

        try {
            AbstractSubmission submission = AbstractSubmission.builder()
                    .referenceCode("ABS-" + shortCode())
                    .reviewStatus("SUBMITTED")
                    .titlePrefix(normalizeRequiredText(request.getTitlePrefix()))
                    .presentationType(normalizeRequiredText(request.getPresentationType()))
                    .firstName(normalizeRequiredText(request.getFirstName()))
                    .lastName(normalizeRequiredText(request.getLastName()))
                    .email(normalizeRequiredText(request.getEmail()))
                    .phone(normalizeRequiredText(request.getPhone()))
                    .organization(normalizeRequiredText(request.getOrganization()))
                    .department(normalizeOptionalText(request.getDepartment()))
                    .country(normalizeRequiredText(request.getCountry()))
                    .abstractTitle(normalizeRequiredText(request.getAbstractTitle()))
                    .sessionTrack(normalizeRequiredText(request.getSessionTrack()))
                    .abstractText(abstractText)
                    .fileName(originalFileName)
                    .fileType(contentType)
                    .fileSize(file.getSize())
                    .fileContentBase64(Base64.getEncoder().encodeToString(file.getBytes()))
                    .build();

            return toResponse(repository.save(submission));
        } catch (IOException exception) {
            throw new IllegalArgumentException("Unable to process the uploaded abstract file.");
        }
    }

    public List<AbstractSubmissionResponse> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public AbstractAttachmentDownload downloadAttachment(String id) {
        AbstractSubmission submission = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Abstract submission not found"));

        return new AbstractAttachmentDownload(
                submission.getFileName(),
                submission.getFileType(),
                Base64.getDecoder().decode(submission.getFileContentBase64().getBytes(StandardCharsets.UTF_8))
        );
    }

    private AbstractSubmissionResponse toResponse(AbstractSubmission submission) {
        return new AbstractSubmissionResponse(
                submission.getId(),
                submission.getReferenceCode(),
                submission.getReviewStatus(),
                submission.getTitlePrefix(),
                submission.getPresentationType(),
                submission.getFirstName(),
                submission.getLastName(),
                submission.getEmail(),
                submission.getPhone(),
                submission.getOrganization(),
                submission.getDepartment(),
                submission.getCountry(),
                submission.getAbstractTitle(),
                submission.getSessionTrack(),
                submission.getAbstractText(),
                submission.getFileName(),
                submission.getFileType(),
                submission.getFileSize(),
                submission.getCreatedAt()
        );
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please upload a DOC, DOCX, or PDF file.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Maximum file size is 5 MB.");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        if (originalFileName.isBlank() || originalFileName.contains("..") || originalFileName.contains("/") || originalFileName.contains("\\")) {
            throw new IllegalArgumentException("Invalid abstract file name.");
        }

        String extension = extractExtension(originalFileName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Accepted file formats are DOC, DOCX, or PDF.");
        }

        String contentType = file.getContentType();
        if (contentType != null && !contentType.isBlank()) {
            String normalizedContentType = contentType.toLowerCase(Locale.ROOT);
            if (!ALLOWED_CONTENT_TYPES.getOrDefault(extension, Set.of()).contains(normalizedContentType)) {
                throw new IllegalArgumentException("Uploaded file content type does not match DOC, DOCX, or PDF.");
            }
        }
    }

    private String extractExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == fileName.length() - 1) {
            throw new IllegalArgumentException("Uploaded file must include an extension.");
        }

        return fileName.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
    }

    private int countWords(String value) {
        return value.trim().isEmpty() ? 0 : value.trim().split("\\s+").length;
    }

    private String normalizeRequiredText(String value) {
        return value.trim();
    }

    private String normalizeOptionalText(String value) {
        return value == null ? "" : value.trim();
    }

    private String shortCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase(Locale.ROOT);
    }
}
