package com.mealsbowls.meal;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DailyMealStatus {
    private LocalDate date;
    private boolean lunchServed;
    private boolean dinnerServed;
    
    // Internal flags to know if we've seen the latest audit log for this meal type
    private boolean lunchProcessed = false;
    private boolean dinnerProcessed = false;

    public DailyMealStatus(LocalDate date, boolean lunchServed, boolean dinnerServed) {
        this.date = date;
        this.lunchServed = lunchServed;
        this.dinnerServed = dinnerServed;
    }
}
