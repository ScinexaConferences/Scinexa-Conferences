package com.scinexa.conferences.site.entity;

import com.scinexa.conferences.common.model.BaseDocument;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "home_hero_settings")
public class HomeHeroSettings extends BaseDocument {

    public static final String SINGLETON_ID = "home-hero";

    private String eyebrow;
    private String title;
    private String description;
    private String countdownTarget;
    private String dateText;
    private String locationText;
    private String delegatesText;
    private String venueText;
    private String primaryCtaLabel;
    private String primaryCtaTo;
    private String secondaryCtaLabel;
    private String secondaryCtaTo;
    private List<HomeHeroResource> resources = new ArrayList<>();
}
