package com.scinexa.conferences.conference.dto;

import com.scinexa.conferences.conference.entity.ConferenceStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ConferenceResponse(
        String id,
        String slug,
        String title,
        String category,
        String shortDescription,
        String venueName,
        String city,
        String country,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal ticketPriceFrom,
        List<String> tracks,
        List<String> keywords,
        ConferenceStatus status,
        boolean featured
) {
}

