package com.scinexa.conferences.site.service;

import com.scinexa.conferences.site.dto.HomeHeroResourceRequest;
import com.scinexa.conferences.site.dto.HomeHeroResourceResponse;
import com.scinexa.conferences.site.dto.HomeHeroSettingsRequest;
import com.scinexa.conferences.site.dto.HomeHeroSettingsResponse;
import com.scinexa.conferences.site.entity.HomeHeroResource;
import com.scinexa.conferences.site.entity.HomeHeroSettings;
import com.scinexa.conferences.site.repository.HomeHeroSettingsRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomeHeroSettingsService {

    private final HomeHeroSettingsRepository repository;

    public HomeHeroSettingsResponse getPublicSettings() {
        return repository.findById(HomeHeroSettings.SINGLETON_ID)
                .map(this::toResponse)
                .orElseGet(this::defaultResponse);
    }

    public HomeHeroSettingsResponse update(HomeHeroSettingsRequest request) {
        HomeHeroSettings settings = repository.findById(HomeHeroSettings.SINGLETON_ID)
                .orElseGet(() -> {
                    HomeHeroSettings created = new HomeHeroSettings();
                    created.setId(HomeHeroSettings.SINGLETON_ID);
                    return created;
                });

        settings.setEyebrow(request.eyebrow().trim());
        settings.setTitle(request.title().trim());
        settings.setDescription(request.description().trim());
        settings.setCountdownTarget(request.countdownTarget().trim());
        settings.setDateText(request.dateText().trim());
        settings.setLocationText(request.locationText().trim());
        settings.setDelegatesText(request.delegatesText().trim());
        settings.setVenueText(request.venueText().trim());
        settings.setPrimaryCtaLabel(request.primaryCtaLabel().trim());
        settings.setPrimaryCtaTo(request.primaryCtaTo().trim());
        settings.setSecondaryCtaLabel(request.secondaryCtaLabel().trim());
        settings.setSecondaryCtaTo(request.secondaryCtaTo().trim());
        settings.setResources(request.resources().stream().map(this::toEntity).toList());

        return toResponse(repository.save(settings));
    }

    private HomeHeroSettingsResponse defaultResponse() {
        return new HomeHeroSettingsResponse(
                "Scinexa Conferences",
                "3rd International Congress on Clinical Microbiology and Infectious Diseases",
                "A high-impact scientific gathering focused on precision diagnostics, antimicrobial resistance, translational care, and the future of infectious disease research.",
                "2026-09-18T09:00",
                "September 18-20, 2026",
                "Singapore Expo Convention Centre",
                "1,500+ researchers and clinicians",
                "Grand Forum Hall, Marina District",
                "Register Now",
                "/registration",
                "Download Brochure",
                "/downloads",
                List.of(
                        new HomeHeroResourceResponse(
                                "Official Brochure",
                                "Program vision, scientific tracks, and registration flow.",
                                "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
                                "/registration",
                                "Download"
                        ),
                        new HomeHeroResourceResponse(
                                "Submit Abstract",
                                "Share your research with our global scientific committee.",
                                "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
                                "/abstract",
                                "Open"
                        ),
                        new HomeHeroResourceResponse(
                                "Speaker Guidelines",
                                "Presentation guidance, timelines, and AV support details.",
                                "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
                                "/speakers",
                                "View"
                        ),
                        new HomeHeroResourceResponse(
                                "Sponsor Prospectus",
                                "Partnership packages for academia, pharma, and biotech.",
                                "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
                                "/sponsors",
                                "Download"
                        )
                )
        );
    }

    private HomeHeroResource toEntity(HomeHeroResourceRequest request) {
        return HomeHeroResource.builder()
                .title(request.title().trim())
                .subtitle(request.subtitle().trim())
                .image(request.image().trim())
                .to(request.to().trim())
                .action(request.action().trim())
                .build();
    }

    private HomeHeroSettingsResponse toResponse(HomeHeroSettings settings) {
        return new HomeHeroSettingsResponse(
                settings.getEyebrow(),
                settings.getTitle(),
                settings.getDescription(),
                settings.getCountdownTarget(),
                settings.getDateText(),
                settings.getLocationText(),
                settings.getDelegatesText(),
                settings.getVenueText(),
                settings.getPrimaryCtaLabel(),
                settings.getPrimaryCtaTo(),
                settings.getSecondaryCtaLabel(),
                settings.getSecondaryCtaTo(),
                Optional.ofNullable(settings.getResources()).orElse(List.of()).stream().map(this::toResponse).toList()
        );
    }

    private HomeHeroResourceResponse toResponse(HomeHeroResource resource) {
        return new HomeHeroResourceResponse(
                resource.getTitle(),
                resource.getSubtitle(),
                resource.getImage(),
                resource.getTo(),
                resource.getAction()
        );
    }
}
