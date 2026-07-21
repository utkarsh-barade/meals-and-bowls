package com.mealsbowls.meal;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.subscription.Subscription;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "meal_audit_logs")
@CompoundIndexes({
    @CompoundIndex(name = "customer_meal_date_type", def = "{'customer.$id': 1, 'mealDate': 1, 'mealType': 1}"),
    @CompoundIndex(name = "customer_meal_date", def = "{'customer.$id': 1, 'mealDate': 1}"),
    @CompoundIndex(name = "meal_date_type_action", def = "{'mealDate': 1, 'mealType': 1, 'action': 1}")
})
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
