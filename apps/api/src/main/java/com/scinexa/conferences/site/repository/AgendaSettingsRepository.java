package com.scinexa.conferences.site.repository;

import com.scinexa.conferences.site.entity.AgendaSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AgendaSettingsRepository extends MongoRepository<AgendaSettings, String> {
}
