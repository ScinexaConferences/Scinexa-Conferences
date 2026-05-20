package com.scinexa.conferences.site.service;

import com.scinexa.conferences.site.dto.SpeakerProfileRequest;
import com.scinexa.conferences.site.dto.SpeakerProfileResponse;
import com.scinexa.conferences.site.dto.SpeakersSettingsRequest;
import com.scinexa.conferences.site.dto.SpeakersSettingsResponse;
import com.scinexa.conferences.site.entity.SpeakerProfile;
import com.scinexa.conferences.site.entity.SpeakersSettings;
import com.scinexa.conferences.site.repository.SpeakersSettingsRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpeakersSettingsService {

    private final SpeakersSettingsRepository repository;

    public SpeakersSettingsResponse getPublicSettings() {
        return repository.findById(SpeakersSettings.SINGLETON_ID)
                .map(this::toResponse)
                .orElseGet(this::defaultResponse);
    }

    public SpeakersSettingsResponse update(SpeakersSettingsRequest request) {
        SpeakersSettings settings = repository.findById(SpeakersSettings.SINGLETON_ID)
                .orElseGet(() -> {
                    SpeakersSettings created = new SpeakersSettings();
                    created.setId(SpeakersSettings.SINGLETON_ID);
                    return created;
                });

        settings.setSpeakers(request.speakers().stream().map(this::toEntity).toList());
        return toResponse(repository.save(settings));
    }

    private SpeakersSettingsResponse defaultResponse() {
        return new SpeakersSettingsResponse(List.of(
                new SpeakerProfileResponse(
                        "Dr. Sarah Chen",
                        "Head of Microbiology",
                        "Mayo Clinic",
                        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
                        "Key Note"
                ),
                new SpeakerProfileResponse(
                        "Dr. Michael Torres",
                        "Chief Scientist",
                        "Infectious Research Inst.",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
                        "Speakers"
                ),
                new SpeakerProfileResponse(
                        "Dr. Elena Rodriguez",
                        "Professor of Virology",
                        "Oxford University",
                        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
                        "Speakers"
                ),
                new SpeakerProfileResponse(
                        "Dr. Robert Wilson",
                        "Director",
                        "CDC Labs",
                        "https://images.unsplash.com/photo-1614436163996-25cee5f54290?auto=format&fit=crop&w=900&q=80",
                        "Poster"
                ),
                new SpeakerProfileResponse(
                        "Dr. Linda Kaspar",
                        "Senior Microbiologist",
                        "Pasteur Institute",
                        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
                        "Virtual"
                ),
                new SpeakerProfileResponse(
                        "Dr. James Oakley",
                        "Public Health Advisor",
                        "WHO Europe",
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
                        "Delegate"
                )
        ));
    }

    private SpeakerProfile toEntity(SpeakerProfileRequest request) {
        return SpeakerProfile.builder()
                .name(request.name().trim())
                .title(request.title().trim())
                .organization(request.organization().trim())
                .image(request.image().trim())
                .category(request.category().trim())
                .build();
    }

    private SpeakersSettingsResponse toResponse(SpeakersSettings settings) {
        return new SpeakersSettingsResponse(
                Optional.ofNullable(settings.getSpeakers()).orElse(List.of()).stream().map(this::toResponse).toList()
        );
    }

    private SpeakerProfileResponse toResponse(SpeakerProfile speaker) {
        return new SpeakerProfileResponse(
                speaker.getName(),
                speaker.getTitle(),
                speaker.getOrganization(),
                speaker.getImage(),
                speaker.getCategory()
        );
    }
}
