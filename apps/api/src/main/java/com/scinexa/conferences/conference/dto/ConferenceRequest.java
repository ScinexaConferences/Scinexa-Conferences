package com.scinexa.conferences.conference.dto;

import com.scinexa.conferences.conference.entity.ConferenceStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ConferenceRequest(
        @NotBlank String slug,
        @NotBlank String title,
        @NotBlank String category,
        @NotBlank String shortDescription,
        @NotBlank String venueName,
        @NotBlank String city,
        @NotBlank String country,
        @NotNull @Future LocalDate startDate,
        @NotNull @Future LocalDate endDate,
        @NotNull BigDecimal ticketPriceFrom,
        List<String> tracks,
        List<String> keywords,
        @NotNull ConferenceStatus status,
        boolean featured
) {
}

