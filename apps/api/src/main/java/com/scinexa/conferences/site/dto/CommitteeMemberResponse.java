package com.scinexa.conferences.site.dto;

public record CommitteeMemberResponse(
        String name,
        String role,
        String organization,
        String image
) {
}
