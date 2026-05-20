package com.scinexa.conferences.conference.mapper;

import com.scinexa.conferences.conference.dto.ConferenceRequest;
import com.scinexa.conferences.conference.dto.ConferenceResponse;
import com.scinexa.conferences.conference.entity.Conference;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ConferenceMapper {

    Conference toEntity(ConferenceRequest request);

    ConferenceResponse toResponse(Conference conference);

    void updateEntity(ConferenceRequest request, @MappingTarget Conference conference);
}

