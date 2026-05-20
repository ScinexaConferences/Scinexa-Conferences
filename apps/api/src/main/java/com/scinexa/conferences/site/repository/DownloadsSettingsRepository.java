package com.scinexa.conferences.site.repository;

import com.scinexa.conferences.site.entity.DownloadsSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DownloadsSettingsRepository extends MongoRepository<DownloadsSettings, String> {
}
