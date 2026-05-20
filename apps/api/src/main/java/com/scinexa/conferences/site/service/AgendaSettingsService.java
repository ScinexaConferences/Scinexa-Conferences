package com.scinexa.conferences.site.service;

import com.scinexa.conferences.site.dto.AgendaDayRequest;
import com.scinexa.conferences.site.dto.AgendaDayResponse;
import com.scinexa.conferences.site.dto.AgendaEntryRequest;
import com.scinexa.conferences.site.dto.AgendaEntryResponse;
import com.scinexa.conferences.site.dto.AgendaSettingsRequest;
import com.scinexa.conferences.site.dto.AgendaSettingsResponse;
import com.scinexa.conferences.site.entity.AgendaDay;
import com.scinexa.conferences.site.entity.AgendaEntry;
import com.scinexa.conferences.site.entity.AgendaSettings;
import com.scinexa.conferences.site.repository.AgendaSettingsRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgendaSettingsService {

    private final AgendaSettingsRepository repository;

    public AgendaSettingsResponse getPublicSettings() {
        return repository.findById(AgendaSettings.SINGLETON_ID)
                .map(this::toResponse)
                .orElseGet(this::defaultResponse);
    }

    public AgendaSettingsResponse update(AgendaSettingsRequest request) {
        AgendaSettings settings = repository.findById(AgendaSettings.SINGLETON_ID)
                .orElseGet(() -> {
                    AgendaSettings created = new AgendaSettings();
                    created.setId(AgendaSettings.SINGLETON_ID);
                    return created;
                });

        settings.setDays(request.days().stream().map(this::toEntity).toList());
        return toResponse(repository.save(settings));
    }

    private AgendaSettingsResponse defaultResponse() {
        return new AgendaSettingsResponse(List.of(
                new AgendaDayResponse(
                        "day-1",
                        "Day 1",
                        List.of(
                                new AgendaEntryResponse("08:00 AM", "Registration & Continental Breakfast", "Grand Auditorium", "Arrival and badge collection", "Break"),
                                new AgendaEntryResponse("09:00 AM", "Welcome and Opening Ceremony", "Innovation Hall", "Conference leadership team", "Networking"),
                                new AgendaEntryResponse("10:00 AM", "Keynote: Engineering the Future of Bacterial Resistance", "Collaboration Studio", "Lead: Dr. Sarah Chen", "Keynote"),
                                new AgendaEntryResponse("11:15 AM", "Coffee Break & Poster Viewing", "Summit Room", "Poster authors and delegates", "Break"),
                                new AgendaEntryResponse("12:00 PM", "Viral Genomics: From Code to Cure", "Grand Auditorium", "Lead: Dr. Elena Rodriguez", "Session"),
                                new AgendaEntryResponse("01:30 PM", "Symposium Lunch", "Innovation Hall", "Hosted networking tables", "Networking"),
                                new AgendaEntryResponse("02:30 PM", "Clinical Trials in Infectious Diseases", "Collaboration Studio", "Lead: Dr. Robert Wilson", "Session"),
                                new AgendaEntryResponse("04:00 PM", "Fireside Chat: The AI Revolution in Lab Diagnosis", "Summit Room", "Lead: Dr. Michael Torres", "Session")
                        )
                ),
                new AgendaDayResponse(
                        "day-2",
                        "Day 2",
                        List.of(
                                new AgendaEntryResponse("08:30 AM", "Breakfast Roundtables", "Networking Lounge", "Moderator-led delegate meetups", "Networking"),
                                new AgendaEntryResponse("09:30 AM", "Diagnostics Panel: Rapid Testing in High-Burden Regions", "Innovation Hall", "Lead: Prof. Hannah Lee", "Panel"),
                                new AgendaEntryResponse("11:00 AM", "Case Forum: Antimicrobial Stewardship in Practice", "Clinical Forum", "Lead: Dr. Yash Patel", "Session"),
                                new AgendaEntryResponse("01:00 PM", "Industry Lunch Exchange", "Grand Auditorium", "Sponsors and hospital innovators", "Networking"),
                                new AgendaEntryResponse("02:15 PM", "Workshop: Translating Surveillance into Policy", "Collaboration Studio", "Lead: Dr. Fatima Noor", "Workshop"),
                                new AgendaEntryResponse("04:15 PM", "Poster Jury & Innovation Showcase", "Summit Room", "Scientific committee review", "Session")
                        )
                ),
                new AgendaDayResponse(
                        "day-3",
                        "Day 3",
                        List.of(
                                new AgendaEntryResponse("09:00 AM", "Breakfast Briefing: Global Data Sharing", "Networking Lounge", "Program office", "Networking"),
                                new AgendaEntryResponse("10:00 AM", "Clinical Microbiology Leadership Forum", "Grand Auditorium", "Lead: Prof. Amina Solberg", "Keynote"),
                                new AgendaEntryResponse("11:30 AM", "Breakout Sessions: Implementation and Scale", "Parallel Rooms", "Track facilitators", "Session"),
                                new AgendaEntryResponse("01:00 PM", "Delegate Lunch", "Innovation Hall", "Hosted by Scinexa", "Break"),
                                new AgendaEntryResponse("02:15 PM", "Closing Plenary: Future-Proofing Infectious Disease Research", "Grand Auditorium", "Lead: Dr. Marcus Bell", "Plenary"),
                                new AgendaEntryResponse("03:45 PM", "Awards, Closing Notes & Next Edition Reveal", "Grand Auditorium", "Conference leadership team", "Closing")
                        )
                )
        ));
    }

    private AgendaDay toEntity(AgendaDayRequest request) {
        return AgendaDay.builder()
                .id(request.id().trim())
                .label(request.label().trim())
                .items(request.items().stream().map(this::toEntity).toList())
                .build();
    }

    private AgendaEntry toEntity(AgendaEntryRequest request) {
        return AgendaEntry.builder()
                .time(request.time().trim())
                .title(request.title().trim())
                .room(request.room().trim())
                .lead(request.lead().trim())
                .tag(request.tag().trim())
                .build();
    }

    private AgendaSettingsResponse toResponse(AgendaSettings settings) {
        return new AgendaSettingsResponse(
                Optional.ofNullable(settings.getDays()).orElse(List.of()).stream().map(this::toResponse).toList()
        );
    }

    private AgendaDayResponse toResponse(AgendaDay day) {
        return new AgendaDayResponse(
                day.getId(),
                day.getLabel(),
                Optional.ofNullable(day.getItems()).orElse(List.of()).stream().map(this::toResponse).toList()
        );
    }

    private AgendaEntryResponse toResponse(AgendaEntry entry) {
        return new AgendaEntryResponse(
                entry.getTime(),
                entry.getTitle(),
                entry.getRoom(),
                entry.getLead(),
                entry.getTag()
        );
    }
}
