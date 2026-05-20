package com.scinexa.conferences.conference.service;

import com.scinexa.conferences.common.exception.ResourceNotFoundException;
import com.scinexa.conferences.conference.dto.ConferenceRequest;
import com.scinexa.conferences.conference.dto.ConferenceResponse;
import com.scinexa.conferences.conference.entity.Conference;
import com.scinexa.conferences.conference.entity.ConferenceStatus;
import com.scinexa.conferences.conference.mapper.ConferenceMapper;
import com.scinexa.conferences.conference.repository.ConferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConferenceService {

    private final ConferenceRepository conferenceRepository;
    private final ConferenceMapper conferenceMapper;

    public Page<ConferenceResponse> listPublished(String query, Pageable pageable) {
        return conferenceRepository.findByStatusAndTitleContainingIgnoreCase(
                        ConferenceStatus.PUBLISHED, query == null ? "" : query, pageable)
                .map(conferenceMapper::toResponse);
    }

    public ConferenceResponse getBySlug(String slug) {
        Conference conference = conferenceRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Conference not found for slug: " + slug));
        return conferenceMapper.toResponse(conference);
    }

    public ConferenceResponse create(ConferenceRequest request) {
        Conference conference = conferenceMapper.toEntity(request);
        return conferenceMapper.toResponse(conferenceRepository.save(conference));
    }

    public ConferenceResponse update(String id, ConferenceRequest request) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conference not found for id: " + id));
        conferenceMapper.updateEntity(request, conference);
        return conferenceMapper.toResponse(conferenceRepository.save(conference));
    }
}

