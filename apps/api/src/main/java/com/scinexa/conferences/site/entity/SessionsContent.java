package com.scinexa.conferences.site.entity;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SessionsContent {

    private String eyebrow;
    private String title;
    private String description;
    private String ctaTitle;
    private String ctaDescription;
    private String ctaLabel;
    private String ctaTo;
    private List<SessionContentItem> sessions = new ArrayList<>();
}
