package com.scinexa.conferences.site.dto;

import java.util.List;

public record CommitteeSettingsResponse(
        List<CommitteeMemberResponse> members
) {
}
