package com.scinexa.conferences.payment;

import com.scinexa.conferences.common.api.ApiResponse;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
@PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
public class PaymentController {

    @GetMapping("/monitoring")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> monitoring() {
        return ResponseEntity.ok(ApiResponse.success("Payment monitoring snapshot", List.of(
                Map.of("conference", "World Summit on Precision Oncology", "status", "SETTLED", "amount", 28450),
                Map.of("conference", "AI in Clinical Decision Systems Congress", "status", "PENDING", "amount", 12780)
        )));
    }
}

