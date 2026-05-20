package com.scinexa.conferences.site.dto;

public record DownloadResourceResponse(
        String title,
        String description,
        String image,
        String actionLabel,
        String actionTo
) {
}
