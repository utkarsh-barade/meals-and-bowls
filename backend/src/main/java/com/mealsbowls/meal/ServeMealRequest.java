package com.mealsbowls.meal;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ServeMealRequest {
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Meal type is required")
    private MealType mealType;
}
