package com.scinexa.conferences.site.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.site.dto.SpeakersSettingsRequest;
import com.scinexa.conferences.site.dto.SpeakersSettingsResponse;
import com.scinexa.conferences.site.service.SpeakersSettingsService;
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
@RequestMapping("/api/v1/site-settings/speakers")
@RequiredArgsConstructor
public class SpeakersSettingsController {

    private final SpeakersSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<SpeakersSettingsResponse>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.success("Speakers settings fetched", service.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SpeakersSettingsResponse>> updateSettings(
            @Valid @RequestBody SpeakersSettingsRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Speakers settings updated", service.update(request)));
    }
}
