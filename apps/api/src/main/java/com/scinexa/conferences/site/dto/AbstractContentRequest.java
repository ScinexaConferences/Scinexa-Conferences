package com.scinexa.conferences.site.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record AbstractContentRequest(
        @NotBlank String eyebrow,
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String templateLabel,
        @NotBlank String templateTo,
        List<String> guidelines,
        List<String> topics,
        List<String> beforeSubmit,
        List<String> countries,
        List<String> presentationTypes,
        List<String> authorTitles
) {
}
