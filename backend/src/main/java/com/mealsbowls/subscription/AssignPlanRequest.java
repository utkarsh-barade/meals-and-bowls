package com.mealsbowls.subscription;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignPlanRequest {
    @NotNull(message = "Plan ID is required")
    private Long planId;
}
