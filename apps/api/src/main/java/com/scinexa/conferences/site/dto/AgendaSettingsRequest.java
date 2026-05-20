package com.scinexa.conferences.site.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AgendaSettingsRequest(
        @NotEmpty List<@Valid AgendaDayRequest> days
) {
}
