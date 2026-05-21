package com.scinexa.conferences.site.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record SessionsContentRequest(
        @NotBlank String eyebrow,
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String ctaTitle,
        @NotBlank String ctaDescription,
        @NotBlank String ctaLabel,
        @NotBlank String ctaTo,
        List<@Valid SessionContentItemRequest> sessions
) {
}
