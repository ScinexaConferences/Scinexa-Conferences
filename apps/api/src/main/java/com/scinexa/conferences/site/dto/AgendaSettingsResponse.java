package com.scinexa.conferences.site.dto;

import java.util.List;

public record AgendaSettingsResponse(
        List<AgendaDayResponse> days
) {
}
