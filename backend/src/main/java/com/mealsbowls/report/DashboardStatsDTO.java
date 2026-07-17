package com.mealsbowls.report;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalCustomers;
    private long activeCustomers;
    private long lunchServedToday;
    private long dinnerServedToday;
    private long totalMealsServedToday;
    private long plansExpiringSoon;      // within next 7 days
    private double todaysCollection;     // sum of PAID payments today
}
