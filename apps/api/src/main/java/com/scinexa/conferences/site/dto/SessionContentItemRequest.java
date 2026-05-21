package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;

public record SessionContentItemRequest(
        String id,
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String image,
        @NotBlank String format,
        @NotBlank String track,
        @NotBlank String day,
        @NotBlank String actionLabel,
        @NotBlank String actionTo
) {
}
