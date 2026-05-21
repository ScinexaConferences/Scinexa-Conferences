package com.scinexa.conferences.site.entity;

import com.scinexa.conferences.common.model.BaseDocument;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "content_settings")
public class ContentSettings extends BaseDocument {

    public static final String SINGLETON_ID = "core-content";

    private AboutContent about;
    private SessionsContent sessions;
    private AbstractContent abstractSection;
}
