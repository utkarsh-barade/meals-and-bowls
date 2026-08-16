package com.mealsbowls.subscription;

import lombok.Data;

@Data
public class AssignPlanRequest {
    private Long planId;
    
    private Boolean isCustom;
    private String customName;
    private Integer customTotalMeals;
    private Integer customValidityDays;
    private Double customPrice;
}
