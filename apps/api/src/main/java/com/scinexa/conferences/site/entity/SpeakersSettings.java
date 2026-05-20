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
@Document(collection = "speakers_settings")
public class SpeakersSettings extends BaseDocument {

    public static final String SINGLETON_ID = "speakers";

    private List<SpeakerProfile> speakers = new ArrayList<>();
}
