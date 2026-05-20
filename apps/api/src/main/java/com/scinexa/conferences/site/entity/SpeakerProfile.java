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
public class SpeakerProfile {

    private String name;
    private String title;
    private String organization;
    private String image;
    private String category;
}
