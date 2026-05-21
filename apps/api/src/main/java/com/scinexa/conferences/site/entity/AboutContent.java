package com.scinexa.conferences.site.entity;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AboutContent {

    private String eyebrow;
    private String title;
    private String description;
    private String image;
    private String overlayLabel;
    private String overlayTitle;
    private String overlaySubtitle;
    private String ctaLabel;
    private String ctaTo;
    private List<String> paragraphs = new ArrayList<>();
}
