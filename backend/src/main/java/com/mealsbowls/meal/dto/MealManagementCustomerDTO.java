package com.mealsbowls.meal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealManagementCustomerDTO {
    private Long id;
    private String fullName;
    private String mobileNumber;
    private String photoUrl;
    
    private boolean hasActiveSubscription;
    private String planName;
    private Integer mealsRemaining;
    private Integer mealsTotal;
    
    private boolean lunchServed;
    private boolean dinnerServed;
}
