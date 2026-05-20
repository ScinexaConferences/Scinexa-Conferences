package com.scinexa.conferences.site.service;

import com.scinexa.conferences.site.dto.DownloadResourceRequest;
import com.scinexa.conferences.site.dto.DownloadResourceResponse;
import com.scinexa.conferences.site.dto.DownloadsSettingsRequest;
import com.scinexa.conferences.site.dto.DownloadsSettingsResponse;
import com.scinexa.conferences.site.entity.DownloadResource;
import com.scinexa.conferences.site.entity.DownloadsSettings;
import com.scinexa.conferences.site.repository.DownloadsSettingsRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DownloadsSettingsService {

    private final DownloadsSettingsRepository repository;

    public DownloadsSettingsResponse getPublicSettings() {
        return repository.findById(DownloadsSettings.SINGLETON_ID)
                .map(this::toResponse)
                .orElseGet(this::defaultResponse);
    }

    public DownloadsSettingsResponse update(DownloadsSettingsRequest request) {
        DownloadsSettings settings = repository.findById(DownloadsSettings.SINGLETON_ID)
                .orElseGet(() -> {
                    DownloadsSettings created = new DownloadsSettings();
                    created.setId(DownloadsSettings.SINGLETON_ID);
                    return created;
                });

        settings.setResources(request.resources().stream().map(this::toEntity).toList());
        return toResponse(repository.save(settings));
    }

    private DownloadsSettingsResponse defaultResponse() {
        return new DownloadsSettingsResponse(List.of(
                new DownloadResourceResponse(
                        "Official Brochure 2026",
                        "Includes event positioning, session highlights, practical delegate notes, and sponsor-facing presentation cues.",
                        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
                        "Request Brochure",
                        "/registration"
                ),
                new DownloadResourceResponse(
                        "Scientific Program Schedule",
                        "The latest agenda flow with keynotes, breakouts, speaker slots, and networking blocks.",
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
                        "Download",
                        "/agenda"
                ),
                new DownloadResourceResponse(
                        "Abstract Submission Template",
                        "Submission guidance, structure cues, and author-ready formatting support for scientific abstracts.",
                        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
                        "Download",
                        "/abstract"
                ),
                new DownloadResourceResponse(
                        "Official Brochure",
                        "A compact version for delegates who need the conference overview, logistics, and main opportunities at a glance.",
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
                        "Request Brochure",
                        "/contact"
                )
        ));
    }

    private DownloadResource toEntity(DownloadResourceRequest request) {
        return DownloadResource.builder()
                .title(request.title().trim())
                .description(request.description().trim())
                .image(request.image().trim())
                .actionLabel(request.actionLabel().trim())
                .actionTo(request.actionTo().trim())
                .build();
    }

    private DownloadsSettingsResponse toResponse(DownloadsSettings settings) {
        return new DownloadsSettingsResponse(
                Optional.ofNullable(settings.getResources()).orElse(List.of()).stream().map(this::toResponse).toList()
        );
    }

    private DownloadResourceResponse toResponse(DownloadResource resource) {
        return new DownloadResourceResponse(
                resource.getTitle(),
                resource.getDescription(),
                resource.getImage(),
                resource.getActionLabel(),
                resource.getActionTo()
        );
    }
}
