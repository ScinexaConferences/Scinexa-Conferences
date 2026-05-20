package com.scinexa.conferences.site.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.site.dto.DownloadsSettingsRequest;
import com.scinexa.conferences.site.dto.DownloadsSettingsResponse;
import com.scinexa.conferences.site.service.DownloadsSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/site-settings/downloads")
@RequiredArgsConstructor
public class DownloadsSettingsController {

    private final DownloadsSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<DownloadsSettingsResponse>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.success("Downloads settings fetched", service.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DownloadsSettingsResponse>> updateSettings(
            @Valid @RequestBody DownloadsSettingsRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Downloads settings updated", service.update(request)));
    }
}
