package com.scinexa.conferences.site.dto;

import java.util.List;

public record DownloadsSettingsResponse(
        List<DownloadResourceResponse> resources
) {
}
