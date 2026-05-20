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
public class AgendaEntry {

    private String time;
    private String title;
    private String room;
    private String lead;
    private String tag;
}
