package com.mealsbowls.report;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class DailyMealReportDTO {
    private Long customerId;
    private String customerName;
    private String customerMobile;
    private LocalDate mealDate;
    private boolean lunchServed;
    private boolean dinnerServed;
    private int totalMeals;
}
