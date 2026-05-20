package com.scinexa.conferences.conference.controller;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.conference.dto.ConferenceRequest;
import com.scinexa.conferences.conference.dto.ConferenceResponse;
import com.scinexa.conferences.conference.service.ConferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/conferences")
@RequiredArgsConstructor
public class ConferenceController {

    private final ConferenceService conferenceService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ConferenceResponse>>> listPublished(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success("Published conferences fetched", conferenceService.listPublished(query, pageable)));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ConferenceResponse>> getConference(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success("Conference fetched", conferenceService.getBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<ApiResponse<ConferenceResponse>> createConference(@Valid @RequestBody ConferenceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Conference created", conferenceService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<ApiResponse<ConferenceResponse>> updateConference(
            @PathVariable String id,
            @Valid @RequestBody ConferenceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Conference updated", conferenceService.update(id, request)));
    }
}

