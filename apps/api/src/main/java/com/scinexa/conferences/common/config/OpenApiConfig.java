package com.scinexa.conferences.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI conferenceOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Scinexa Conference Platform API")
                .version("v1")
                .description("Scalable backend foundation for conference discovery, registrations, operations, and analytics.")
                .contact(new Contact().name("Scinexa Engineering").email("hello@scinexa.io")));
    }
}

