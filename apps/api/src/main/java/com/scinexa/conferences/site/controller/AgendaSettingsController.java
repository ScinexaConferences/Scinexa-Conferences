package com.scinexa.conferences.site.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.site.dto.AgendaSettingsRequest;
import com.scinexa.conferences.site.dto.AgendaSettingsResponse;
import com.scinexa.conferences.site.service.AgendaSettingsService;
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
@RequestMapping("/api/v1/site-settings/agenda")
@RequiredArgsConstructor
public class AgendaSettingsController {

    private final AgendaSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<AgendaSettingsResponse>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.success("Agenda settings fetched", service.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AgendaSettingsResponse>> updateSettings(
            @Valid @RequestBody AgendaSettingsRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Agenda settings updated", service.update(request)));
    }
}
