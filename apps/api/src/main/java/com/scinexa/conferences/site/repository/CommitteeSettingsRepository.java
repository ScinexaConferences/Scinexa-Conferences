package com.scinexa.conferences.site.repository;

import com.scinexa.conferences.site.entity.CommitteeSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommitteeSettingsRepository extends MongoRepository<CommitteeSettings, String> {
}
