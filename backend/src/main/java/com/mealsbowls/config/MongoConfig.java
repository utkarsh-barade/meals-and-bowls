package com.mealsbowls.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017/meals_bowls}")
    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        try {
            ConnectionString connectionString = new ConnectionString(mongoUri);
            String database = connectionString.getDatabase();
            return (database != null && !database.isEmpty()) ? database : "meals_bowls";
        } catch (Exception e) {
            return "meals_bowls";
        }
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        
        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .applyToConnectionPoolSettings(builder ->
                        builder.minSize(5)                       // Pre-warm 5 connections to Atlas (zero TLS handshake latency)
                               .maxSize(20)                      // Max 20 concurrent connections
                               .maxConnectionIdleTime(30, TimeUnit.SECONDS)
                               .maxConnectionLifeTime(10, TimeUnit.MINUTES)
                )
                .applyToSocketSettings(builder ->
                        builder.connectTimeout(5, TimeUnit.SECONDS)
                               .readTimeout(5, TimeUnit.SECONDS)
                )
                .build();

        return MongoClients.create(mongoClientSettings);
    }
}
