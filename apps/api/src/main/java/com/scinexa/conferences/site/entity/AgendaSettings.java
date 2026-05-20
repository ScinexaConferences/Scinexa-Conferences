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
@Document(collection = "agenda_settings")
public class AgendaSettings extends BaseDocument {

    public static final String SINGLETON_ID = "agenda";

    private List<AgendaDay> days = new ArrayList<>();
}
