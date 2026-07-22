package com.mealsbowls.config;

import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClientSettingsBuilderCustomizer customizer() {
        return builder -> builder
                .applyToConnectionPoolSettings(pool ->
                        pool.minSize(5)                       // Pre-warm 5 connections to Atlas (zero TLS handshake latency)
                            .maxSize(20)                      // Max 20 concurrent connections
                            .maxConnectionIdleTime(30, TimeUnit.SECONDS)
                            .maxConnectionLifeTime(10, TimeUnit.MINUTES)
                )
                .applyToSocketSettings(socket ->
                        socket.connectTimeout(5, TimeUnit.SECONDS)
                              .readTimeout(10, TimeUnit.SECONDS)
                );
    }
}
