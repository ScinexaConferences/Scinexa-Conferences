package com.scinexa.conferences.site.dto;

import java.util.List;

public record HomeHeroSettingsResponse(
        String eyebrow,
        String title,
        String description,
        String countdownTarget,
        String dateText,
        String locationText,
        String delegatesText,
        String venueText,
        String primaryCtaLabel,
        String primaryCtaTo,
        String secondaryCtaLabel,
        String secondaryCtaTo,
        List<HomeHeroResourceResponse> resources
) {
}
