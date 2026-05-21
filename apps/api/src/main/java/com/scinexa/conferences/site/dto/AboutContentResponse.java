package com.scinexa.conferences.site.dto;

import java.util.List;

public record AboutContentResponse(
        String eyebrow,
        String title,
        String description,
        String image,
        String overlayLabel,
        String overlayTitle,
        String overlaySubtitle,
        String ctaLabel,
        String ctaTo,
        List<String> paragraphs
) {
}
