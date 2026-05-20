package com.scinexa.conferences.site.dto;

public record AgendaEntryResponse(
        String time,
        String title,
        String room,
        String lead,
        String tag
) {
}
