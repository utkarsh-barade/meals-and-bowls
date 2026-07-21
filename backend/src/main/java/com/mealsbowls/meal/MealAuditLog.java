package com.mealsbowls.meal;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "meal_audit_logs")
@CompoundIndexes({
    @CompoundIndex(name = "customer_meal_date_type", def = "{'customerId': 1, 'mealDate': 1, 'mealType': 1}"),
    @CompoundIndex(name = "customer_meal_date", def = "{'customerId': 1, 'mealDate': 1}"),
    @CompoundIndex(name = "meal_date_action", def = "{'mealDate': 1, 'action': 1}")
})
@Data
public class MealAuditLog {

    @Id
    private Long id;

    // Flat ID reference — no @DBRef, no extra round-trip
    @Indexed
    private Long customerId;

    // Flat subscription ID reference
    private Long subscriptionId;

    @Indexed
    private LocalDate mealDate;

    private MealType mealType;

    @Indexed
    private MealAction action;

    @CreatedDate
    private LocalDateTime createdAt;
}
