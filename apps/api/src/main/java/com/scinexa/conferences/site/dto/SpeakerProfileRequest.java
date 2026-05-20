package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;

public record SpeakerProfileRequest(
        @NotBlank String name,
        @NotBlank String title,
        @NotBlank String organization,
        @NotBlank String image,
        @NotBlank String category
) {
}
