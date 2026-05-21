package com.scinexa.conferences.site.dto;

public record ContentSettingsResponse(
        AboutContentResponse about,
        SessionsContentResponse sessions,
        AbstractContentResponse abstractSection
) {
}
