package com.scinexa.conferences.file.exception;

import com.scinexa.conferences.common.api.ApiResponse;
import java.util.Map;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class S3ExceptionHandler {

    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleInvalidFile(InvalidFileException exception) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.failure(exception.getMessage(), Map.of("error", "INVALID_FILE")));
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleStorageFailure(FileStorageException exception) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(ApiResponse.failure(exception.getMessage(), Map.of("error", "S3_OPERATION_FAILED")));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleMaxUpload(MaxUploadSizeExceededException exception) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(ApiResponse.failure("Uploaded file exceeds the configured 50MB limit", Map.of("error", "FILE_TOO_LARGE")));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleMissingParameter(MissingServletRequestParameterException exception) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("Missing required request parameter", Map.of("error", exception.getParameterName())));
    }
}
