package com.mealsbowls.report;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class ExpiringPlanDTO {
    private Long subscriptionId;
    private Long customerId;
    private String customerName;
    private String customerMobile;
    private String planName;
    private LocalDate expiryDate;
    private long daysLeft;
    private int mealsRemaining;
}
