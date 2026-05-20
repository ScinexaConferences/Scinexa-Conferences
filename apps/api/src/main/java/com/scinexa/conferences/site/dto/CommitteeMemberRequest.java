package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;

public record CommitteeMemberRequest(
        @NotBlank String name,
        @NotBlank String role,
        @NotBlank String organization,
        @NotBlank String image
) {
}
