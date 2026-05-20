package com.scinexa.conferences.registration.repository;

import com.scinexa.conferences.registration.entity.ConferenceRegistration;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConferenceRegistrationRepository extends MongoRepository<ConferenceRegistration, String> {

    List<ConferenceRegistration> findAllByOrderByCreatedAtDesc();
}
