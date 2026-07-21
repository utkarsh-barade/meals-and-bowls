package com.mealsbowls.subscription;

import com.mealsbowls.customer.Customer;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "subscriptions")
@Data
public class Subscription {

    @Id
    private Long id;

    @DBRef
    private Customer customer;

    @DBRef
    private Plan plan;

    private LocalDate startDate;
    private LocalDate expiryDate;

    private int mealsTotal;
    private int mealsConsumed;

    private SubscriptionStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public int getMealsRemaining() {
        return Math.max(0, mealsTotal - mealsConsumed);
    }
}
