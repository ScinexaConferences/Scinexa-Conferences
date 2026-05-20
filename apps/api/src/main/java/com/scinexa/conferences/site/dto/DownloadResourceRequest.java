package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;

public record DownloadResourceRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String image,
        @NotBlank String actionLabel,
        @NotBlank String actionTo
) {
}
