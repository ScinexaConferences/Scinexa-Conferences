package com.scinexa.conferences.notification;

import com.scinexa.conferences.common.api.ApiResponse;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
public class NotificationController {

    @PostMapping("/campaigns")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendCampaign(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.success("Campaign queued",
                Map.of("queued", true, "audience", request.getOrDefault("audience", "all-subscribers"))));
    }
}

