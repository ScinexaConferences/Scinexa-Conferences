package com.scinexa.conferences.site.service;

import com.scinexa.conferences.site.dto.CommitteeMemberRequest;
import com.scinexa.conferences.site.dto.CommitteeMemberResponse;
import com.scinexa.conferences.site.dto.CommitteeSettingsRequest;
import com.scinexa.conferences.site.dto.CommitteeSettingsResponse;
import com.scinexa.conferences.site.entity.CommitteeMember;
import com.scinexa.conferences.site.entity.CommitteeSettings;
import com.scinexa.conferences.site.repository.CommitteeSettingsRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommitteeSettingsService {

    private final CommitteeSettingsRepository repository;

    public CommitteeSettingsResponse getPublicSettings() {
        return repository.findById(CommitteeSettings.SINGLETON_ID)
                .map(this::toResponse)
                .orElseGet(this::defaultResponse);
    }

    public CommitteeSettingsResponse update(CommitteeSettingsRequest request) {
        CommitteeSettings settings = repository.findById(CommitteeSettings.SINGLETON_ID)
                .orElseGet(() -> {
                    CommitteeSettings created = new CommitteeSettings();
                    created.setId(CommitteeSettings.SINGLETON_ID);
                    return created;
                });

        settings.setMembers(request.members().stream().map(this::toEntity).toList());
        return toResponse(repository.save(settings));
    }

    private CommitteeSettingsResponse defaultResponse() {
        return new CommitteeSettingsResponse(List.of(
                new CommitteeMemberResponse(
                        "Prof. Hans Muller",
                        "Chairman",
                        "Berlin Tech",
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80"
                ),
                new CommitteeMemberResponse(
                        "Dr. Anita Gupta",
                        "Treasurer",
                        "Stanford Medical",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
                ),
                new CommitteeMemberResponse(
                        "Dr. Oliver Thompson",
                        "General Secretary",
                        "University of Cape Town",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                ),
                new CommitteeMemberResponse(
                        "Dr. Beatrice Villeray",
                        "Media Coordinator",
                        "Sorbonne University",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
                ),
                new CommitteeMemberResponse(
                        "Prof. Kenji Sakamoto",
                        "Scientific Chair",
                        "Tokyo University",
                        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80"
                ),
                new CommitteeMemberResponse(
                        "Dr. Elena Rodriguez",
                        "Program Coordinator",
                        "Oxford University",
                        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80"
                )
        ));
    }

    private CommitteeMember toEntity(CommitteeMemberRequest request) {
        return CommitteeMember.builder()
                .name(request.name().trim())
                .role(request.role().trim())
                .organization(request.organization().trim())
                .image(request.image().trim())
                .build();
    }

    private CommitteeSettingsResponse toResponse(CommitteeSettings settings) {
        return new CommitteeSettingsResponse(
                Optional.ofNullable(settings.getMembers()).orElse(List.of()).stream().map(this::toResponse).toList()
        );
    }

    private CommitteeMemberResponse toResponse(CommitteeMember member) {
        return new CommitteeMemberResponse(
                member.getName(),
                member.getRole(),
                member.getOrganization(),
                member.getImage()
        );
    }
}
