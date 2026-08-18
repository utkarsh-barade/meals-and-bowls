package com.mealsbowls;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableMongoAuditing
public class MealsBowlsApplication {

    @PostConstruct
    public void init() {
        // Ensure standard JVM timezone is Indian Standard Time (IST)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        String mongodbUri = System.getenv("MONGODB_URI");
        if (mongodbUri != null && !mongodbUri.trim().isEmpty()) {
            // Sanitize and trim trailing newlines (\n, \r) or spaces from environment variable copy-pastes
            String cleanUri = mongodbUri.trim().replaceAll("[\\r\\n]+", "");
            System.setProperty("spring.data.mongodb.uri", cleanUri);
        }
        SpringApplication.run(MealsBowlsApplication.class, args);
    }
}
