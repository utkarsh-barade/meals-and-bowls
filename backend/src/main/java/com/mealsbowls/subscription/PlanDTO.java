package com.mealsbowls.subscription;

import lombok.Data;

@Data
public class PlanDTO {
    private Long id;
    private String name;
    private int totalMeals;
    private int validityDays;
    private double price;
}
