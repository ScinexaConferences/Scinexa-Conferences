package com.scinexa.conferences.site.repository;

import com.scinexa.conferences.site.entity.ContentSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContentSettingsRepository extends MongoRepository<ContentSettings, String> {
}
