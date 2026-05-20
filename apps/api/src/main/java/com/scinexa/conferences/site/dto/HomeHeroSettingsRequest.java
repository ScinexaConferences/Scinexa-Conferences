package com.scinexa.conferences.site.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record HomeHeroSettingsRequest(
        @NotBlank String eyebrow,
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String countdownTarget,
        @NotBlank String dateText,
        @NotBlank String locationText,
        @NotBlank String delegatesText,
        @NotBlank String venueText,
        @NotBlank String primaryCtaLabel,
        @NotBlank String primaryCtaTo,
        @NotBlank String secondaryCtaLabel,
        @NotBlank String secondaryCtaTo,
        @NotEmpty List<@Valid HomeHeroResourceRequest> resources
) {
}
