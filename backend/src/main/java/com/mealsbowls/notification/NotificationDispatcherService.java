package com.mealsbowls.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class NotificationDispatcherService {

    private final WhatsAppNotificationService whatsAppNotificationService;
    private final FastSmsNotificationService fastSmsNotificationService;

    @Value("${NOTIFICATION_PROVIDER:WHATSAPP}")
    private String notificationProvider;

    public NotificationDispatcherService(WhatsAppNotificationService whatsAppNotificationService,
                                         FastSmsNotificationService fastSmsNotificationService) {
        this.whatsAppNotificationService = whatsAppNotificationService;
        this.fastSmsNotificationService = fastSmsNotificationService;
    }

    @Async
    public CompletableFuture<Void> sendNotification(String toPhoneNumber, String message) {
        String provider = notificationProvider != null ? notificationProvider.trim().toUpperCase() : "WHATSAPP";

        if ("SMS".equalsIgnoreCase(provider)) {
            log.info("Sending notification via SMS provider to {}", toPhoneNumber);
            fastSmsNotificationService.sendSms(toPhoneNumber, message);
        } else if ("BOTH".equalsIgnoreCase(provider)) {
            log.info("Sending notification via BOTH WhatsApp and SMS to {}", toPhoneNumber);
            whatsAppNotificationService.sendNotification(toPhoneNumber, message);
            fastSmsNotificationService.sendSms(toPhoneNumber, message);
        } else if ("NONE".equalsIgnoreCase(provider) || "OFF".equalsIgnoreCase(provider)) {
            log.info("Notifications are turned OFF. Skipping notification to {}", toPhoneNumber);
        } else {
            // Default to WHATSAPP
            log.info("Sending notification via WhatsApp provider to {}", toPhoneNumber);
            whatsAppNotificationService.sendNotification(toPhoneNumber, message);
        }

        return CompletableFuture.completedFuture(null);
    }

    public Map<String, Object> testNotificationSync(String toPhoneNumber) {
        Map<String, Object> result = new HashMap<>();
        String provider = notificationProvider != null ? notificationProvider.trim().toUpperCase() : "WHATSAPP";
        result.put("activeProviderConfig", provider);

        if ("SMS".equalsIgnoreCase(provider)) {
            result.put("smsTest", fastSmsNotificationService.sendSmsSync(toPhoneNumber, "Test SMS Notification from Meals & Bowls"));
        } else if ("BOTH".equalsIgnoreCase(provider)) {
            result.put("whatsAppTest", whatsAppNotificationService.testNotificationSync(toPhoneNumber));
            result.put("smsTest", fastSmsNotificationService.sendSmsSync(toPhoneNumber, "Test SMS Notification from Meals & Bowls"));
        } else {
            result.put("whatsAppTest", whatsAppNotificationService.testNotificationSync(toPhoneNumber));
        }

        return result;
    }
}
