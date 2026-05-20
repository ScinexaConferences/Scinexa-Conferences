package com.scinexa.conferences.conference.repository;

import com.scinexa.conferences.conference.entity.Conference;
import com.scinexa.conferences.conference.entity.ConferenceStatus;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConferenceRepository extends MongoRepository<Conference, String> {

    Optional<Conference> findBySlug(String slug);

    Page<Conference> findByStatusAndTitleContainingIgnoreCase(ConferenceStatus status, String query, Pageable pageable);
}

