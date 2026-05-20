package com.scinexa.conferences.registration;

import com.scinexa.conferences.common.api.ApiResponse;
import com.scinexa.conferences.registration.dto.RegistrationRequest;
import com.scinexa.conferences.registration.dto.RegistrationResponse;
import com.scinexa.conferences.registration.service.RegistrationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService service;

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponse>> createRegistration(
            @Valid @RequestBody RegistrationRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Registration submitted successfully", service.create(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> listRegistrations() {
        return ResponseEntity.ok(ApiResponse.success("Registrations fetched", service.listAll()));
    }
}
