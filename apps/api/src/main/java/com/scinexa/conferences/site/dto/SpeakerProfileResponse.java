package com.scinexa.conferences.site.dto;

public record SpeakerProfileResponse(
        String name,
        String title,
        String organization,
        String image,
        String category
) {
}
