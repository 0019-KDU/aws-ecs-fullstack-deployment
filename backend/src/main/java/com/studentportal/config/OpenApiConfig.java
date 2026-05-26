package com.studentportal.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI studentPortalOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Student Portal API")
                        .description("REST API for managing students")
                        .version("v1.0.0")
                        .contact(new Contact().name("Student Portal Team"))
                        .license(new License().name("Apache 2.0")));
    }
}
