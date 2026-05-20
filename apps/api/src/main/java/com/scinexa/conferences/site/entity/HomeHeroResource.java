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
public class HomeHeroResource {

    private String title;
    private String subtitle;
    private String image;
    private String to;
    private String action;
}
