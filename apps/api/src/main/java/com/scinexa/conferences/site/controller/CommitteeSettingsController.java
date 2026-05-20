package com.scinexa.conferences.site.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.site.dto.CommitteeSettingsRequest;
import com.scinexa.conferences.site.dto.CommitteeSettingsResponse;
import com.scinexa.conferences.site.service.CommitteeSettingsService;
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
@RequestMapping("/api/v1/site-settings/committee")
@RequiredArgsConstructor
public class CommitteeSettingsController {

    private final CommitteeSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<CommitteeSettingsResponse>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.success("Committee settings fetched", service.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CommitteeSettingsResponse>> updateSettings(
            @Valid @RequestBody CommitteeSettingsRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Committee settings updated", service.update(request)));
    }
}
