package com.scinexa.conferences.site.dto;

import java.util.List;

public record AgendaDayResponse(
        String id,
        String label,
        List<AgendaEntryResponse> items
) {
}
