package com.mealsbowls.subscription;

import com.mealsbowls.subscription.Plan;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "subscriptions")
@CompoundIndex(name = "customer_status", def = "{'customerId': 1, 'status': 1}")
@Data
public class Subscription {

    @Id
    private Long id;

    // Flat ID reference — no @DBRef, no extra round-trip
    @Indexed
    private Long customerId;

    // Embedded plan info — avoids loading Plan document on every read
    private Long planId;
    private String planName;
    private Double planPrice;

    private LocalDate startDate;
    private LocalDate expiryDate;

    private int mealsTotal;
    private int mealsConsumed;

    @Indexed
    private SubscriptionStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public int getMealsRemaining() {
        return Math.max(0, mealsTotal - mealsConsumed);
    }
}
