package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;

public record AgendaEntryRequest(
        @NotBlank String time,
        @NotBlank String title,
        @NotBlank String room,
        @NotBlank String lead,
        @NotBlank String tag
) {
}
