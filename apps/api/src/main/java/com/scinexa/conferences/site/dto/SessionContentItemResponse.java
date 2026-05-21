package com.scinexa.conferences.site.dto;

public record SessionContentItemResponse(
        String id,
        String title,
        String description,
        String image,
        String format,
        String track,
        String day,
        String actionLabel,
        String actionTo
) {
}
