package com.scinexa.conferences.site.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SessionContentItem {

    private String id;
    private String title;
    private String description;
    private String image;
    private String format;
    private String track;
    private String day;
    private String actionLabel;
    private String actionTo;
}
