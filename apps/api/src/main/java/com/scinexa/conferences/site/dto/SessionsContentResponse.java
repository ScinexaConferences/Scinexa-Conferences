package com.scinexa.conferences.site.dto;

import java.util.List;

public record SessionsContentResponse(
        String eyebrow,
        String title,
        String description,
        String ctaTitle,
        String ctaDescription,
        String ctaLabel,
        String ctaTo,
        List<SessionContentItemResponse> sessions
) {
}
