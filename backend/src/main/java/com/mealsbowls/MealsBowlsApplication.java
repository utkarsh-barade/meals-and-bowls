package com.mealsbowls;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableMongoAuditing
public class MealsBowlsApplication {

    public static void main(String[] args) {
        String mongodbUri = System.getenv("MONGODB_URI");
        if (mongodbUri != null && !mongodbUri.trim().isEmpty()) {
            // Sanitize and trim trailing newlines (\n, \r) or spaces from environment variable copy-pastes
            String cleanUri = mongodbUri.trim().replaceAll("[\\r\\n]+", "");
            System.setProperty("spring.data.mongodb.uri", cleanUri);
        }
        SpringApplication.run(MealsBowlsApplication.class, args);
    }
}
