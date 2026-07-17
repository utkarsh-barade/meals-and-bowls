package com.mealsbowls.customer.dto;

import com.mealsbowls.subscription.PlanDTO;
import com.mealsbowls.subscription.SubscriptionDTO;
import com.mealsbowls.payment.PaymentDTO;
import com.mealsbowls.meal.DailyMealStatus;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CustomerDashboardDTO {
    private SubscriptionDTO activeSubscription;
    private DailyMealStatus todayMealStatus;
    private List<PaymentDTO> pendingPayments;
}
