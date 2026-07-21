package com.mealsbowls.meal;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.subscription.Subscription;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "meal_audit_logs")
@Data
public class MealAuditLog {

    @Id
    private Long id;

    @DBRef
    private Customer customer;

    @DBRef
    private Subscription subscription;

    private LocalDate mealDate;

    private MealType mealType;

    private MealAction action;

    @CreatedDate
    private LocalDateTime createdAt;
}
