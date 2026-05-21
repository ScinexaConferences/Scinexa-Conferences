package com.scinexa.conferences.site.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ContentSettingsRequest(
        @Valid @NotNull AboutContentRequest about,
        @Valid @NotNull SessionsContentRequest sessions,
        @Valid @NotNull AbstractContentRequest abstractSection
) {
}
