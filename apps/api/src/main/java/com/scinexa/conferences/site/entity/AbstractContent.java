package com.scinexa.conferences.site.entity;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AbstractContent {

    private String eyebrow;
    private String title;
    private String description;
    private String templateLabel;
    private String templateTo;
    private List<String> guidelines = new ArrayList<>();
    private List<String> topics = new ArrayList<>();
    private List<String> beforeSubmit = new ArrayList<>();
    private List<String> countries = new ArrayList<>();
    private List<String> presentationTypes = new ArrayList<>();
    private List<String> authorTitles = new ArrayList<>();
}
