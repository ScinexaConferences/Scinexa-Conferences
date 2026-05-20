package com.scinexa.conferences.site.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DownloadResource {

    private String title;
    private String description;
    private String image;
    private String actionLabel;
    private String actionTo;
}
