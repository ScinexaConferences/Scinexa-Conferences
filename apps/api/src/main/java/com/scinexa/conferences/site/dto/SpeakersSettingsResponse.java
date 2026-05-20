package com.scinexa.conferences.site.dto;

import java.util.List;

public record SpeakersSettingsResponse(
        List<SpeakerProfileResponse> speakers
) {
}
