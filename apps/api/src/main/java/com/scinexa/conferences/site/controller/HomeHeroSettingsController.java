package com.scinexa.conferences.site.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.site.dto.HomeHeroSettingsRequest;
import com.scinexa.conferences.site.dto.HomeHeroSettingsResponse;
import com.scinexa.conferences.site.service.HomeHeroSettingsService;
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
@RequestMapping("/api/v1/site-settings/home-hero")
@RequiredArgsConstructor
public class HomeHeroSettingsController {

    private final HomeHeroSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<HomeHeroSettingsResponse>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.success("Home hero settings fetched", service.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HomeHeroSettingsResponse>> updateSettings(
            @Valid @RequestBody HomeHeroSettingsRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Home hero settings updated", service.update(request)));
    }
}
