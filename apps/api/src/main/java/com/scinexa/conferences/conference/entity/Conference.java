package com.scinexa.conferences.conference.entity;

import com.scinexa.conferences.common.model.BaseDocument;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "conferences")
@CompoundIndex(name = "conference_search_idx", def = "{'status': 1, 'category': 1, 'startDate': 1}")
public class Conference extends BaseDocument {

    @Indexed(unique = true)
    private String slug;

    private String title;
    private String category;
    private String shortDescription;
    private String venueName;
    private String city;
    private String country;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal ticketPriceFrom;
    private List<String> tracks;
    private List<String> keywords;
    private ConferenceStatus status;
    private boolean featured;
}

