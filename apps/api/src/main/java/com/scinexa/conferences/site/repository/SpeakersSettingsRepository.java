package com.scinexa.conferences.site.repository;

import com.scinexa.conferences.site.entity.SpeakersSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SpeakersSettingsRepository extends MongoRepository<SpeakersSettings, String> {
}
