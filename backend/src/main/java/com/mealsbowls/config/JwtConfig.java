package com.mealsbowls.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {

    /** JWT signing secret — must be set via JWT_SECRET env var in production. */
    private String secret;

    /** Token validity in milliseconds (default: 24 hours). */
    private long expiryMs;
}
