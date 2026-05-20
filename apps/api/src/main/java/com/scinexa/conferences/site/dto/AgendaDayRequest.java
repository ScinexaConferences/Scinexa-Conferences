package com.scinexa.conferences.site.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AgendaDayRequest(
        @NotBlank String id,
        @NotBlank String label,
        @NotEmpty List<@Valid AgendaEntryRequest> items
) {
}
