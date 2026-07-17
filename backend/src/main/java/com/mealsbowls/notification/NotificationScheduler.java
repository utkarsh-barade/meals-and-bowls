package com.mealsbowls.notification;

import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionRepository;
import com.mealsbowls.subscription.SubscriptionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final WhatsAppNotificationService notificationService;

    // Run every day at 10 AM (0 0 10 * * ?)
    @Scheduled(cron = "0 0 10 * * ?")
    public void sendPlanExpiryReminders() {
        log.info("Running daily Plan Expiry Reminder job...");
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        
        // Custom query method or simply fetch all active and filter
        // We'll fetch all active and filter here for simplicity. 
        // In a large system, this should be done via a DB query.
        List<Subscription> activeSubscriptions = subscriptionRepository.findAll();
        
        for (Subscription sub : activeSubscriptions) {
            if (sub.getStatus() == SubscriptionStatus.ACTIVE && tomorrow.equals(sub.getExpiryDate())) {
                String msg = "⏰ Meals & Bowls\n\n" +
                             "Hello " + sub.getCustomer().getFullName() + ",\n\n" +
                             "Your subscription will expire on " + sub.getExpiryDate() + ".\n\n" +
                             "Remaining Meals: " + sub.getMealsRemaining() + "\n\n" +
                             "Please renew your plan to continue enjoying uninterrupted meals.";
                notificationService.sendNotification(sub.getCustomer().getMobileNumber(), msg);
            }
        }
        log.info("Completed daily Plan Expiry Reminder job.");
    }
}
