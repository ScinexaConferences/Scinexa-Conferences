package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;

public record HomeHeroResourceRequest(
        @NotBlank String title,
        @NotBlank String subtitle,
        @NotBlank String image,
        @NotBlank String to,
        @NotBlank String action
) {
}
