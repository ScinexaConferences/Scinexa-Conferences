package com.scinexa.conferences.site.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.site.dto.ContentSettingsRequest;
import com.scinexa.conferences.site.dto.ContentSettingsResponse;
import com.scinexa.conferences.site.service.ContentSettingsService;
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
@RequestMapping("/api/v1/site-settings/content")
@RequiredArgsConstructor
public class ContentSettingsController {

    private final ContentSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<ContentSettingsResponse>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.success("Content settings fetched", service.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContentSettingsResponse>> updateSettings(
            @Valid @RequestBody ContentSettingsRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Content settings updated", service.update(request)));
    }
}
