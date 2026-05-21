package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record AboutContentRequest(
        @NotBlank String eyebrow,
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String image,
        @NotBlank String overlayLabel,
        @NotBlank String overlayTitle,
        @NotBlank String overlaySubtitle,
        @NotBlank String ctaLabel,
        @NotBlank String ctaTo,
        List<String> paragraphs
) {
}
