package com.scinexa.conferences.dashboard;

import com.scinexa.conferences.common.api.ApiResponse;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Map<String, Object>>> publicOverview() {
        return ResponseEntity.ok(ApiResponse.success("Public dashboard snapshot",
                Map.of("publishedConferences", 128, "countries", 34, "averageRating", 4.8)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminOverview() {
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard snapshot",
                Map.of("pendingApprovals", 18, "paymentsFlagged", 4, "openAbstracts", 942)));
    }
}

