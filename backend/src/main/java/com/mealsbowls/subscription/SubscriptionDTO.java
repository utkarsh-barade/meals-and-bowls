package com.mealsbowls.subscription;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SubscriptionDTO {
    private Long id;
    private Long customerId;
    private PlanDTO plan;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private int mealsTotal;
    private int mealsConsumed;
    private int mealsRemaining;
    private String status;
}
