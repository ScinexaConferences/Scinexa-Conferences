package com.scinexa.conferences.site.repository;

import com.scinexa.conferences.site.entity.HomeHeroSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HomeHeroSettingsRepository extends MongoRepository<HomeHeroSettings, String> {
}
