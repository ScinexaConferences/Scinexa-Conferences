package com.scinexa.conferences.bootstrap;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "bootstrap.admin")
public class DevAdminProperties {

    private boolean enabled = true;

    private String fullName = "Scinexa Admin";

    private String email = "admin@scinexa.local";

    private String password = "Admin@12345";

    private boolean resetPasswordOnStartup = true;
}
