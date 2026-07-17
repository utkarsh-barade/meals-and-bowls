package com.mealsbowls.subscription;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SubscriptionExpiryTask {

    private final SubscriptionRepository subscriptionRepository;

    @Scheduled(cron = "0 0 0 * * *") // Run at midnight every day
    @Transactional
    public void expireOldSubscriptions() {
        log.info("Running scheduled task to expire old subscriptions");
        List<Subscription> activeSubscriptions = subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE);
        LocalDate today = LocalDate.now();

        int expiredCount = 0;
        for (Subscription sub : activeSubscriptions) {
            if (sub.getExpiryDate().isBefore(today)) {
                sub.setStatus(SubscriptionStatus.EXPIRED);
                subscriptionRepository.save(sub);
                expiredCount++;
            }
        }
        log.info("Expired {} subscriptions", expiredCount);
    }
}
