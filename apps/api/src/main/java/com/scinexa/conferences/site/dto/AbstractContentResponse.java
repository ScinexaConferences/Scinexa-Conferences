package com.scinexa.conferences.site.dto;

import java.util.List;

public record AbstractContentResponse(
        String eyebrow,
        String title,
        String description,
        String templateLabel,
        String templateTo,
        List<String> guidelines,
        List<String> topics,
        List<String> beforeSubmit,
        List<String> countries,
        List<String> presentationTypes,
        List<String> authorTitles
) {
}
