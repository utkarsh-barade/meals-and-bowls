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
    private final WhatsAppGatewayService whatsAppGatewayService;

    @Value("${app.notification.provider:${NOTIFICATION_PROVIDER:WHATSAPP_GATEWAY}}")
    private String notificationProvider;

    private volatile boolean notificationsEnabled = true;

    public NotificationDispatcherService(WhatsAppNotificationService whatsAppNotificationService,
                                         FastSmsNotificationService fastSmsNotificationService,
                                         WhatsAppGatewayService whatsAppGatewayService) {
        this.whatsAppNotificationService = whatsAppNotificationService;
        this.fastSmsNotificationService = fastSmsNotificationService;
        this.whatsAppGatewayService = whatsAppGatewayService;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(boolean enabled) {
        this.notificationsEnabled = enabled;
        log.info("[Dispatcher] Master WhatsApp Notifications toggled to: {}", enabled ? "ENABLED" : "MUTED (OFF)");
    }

    @Async
    public CompletableFuture<Void> sendNotification(String toPhoneNumber, String message) {
        if (!notificationsEnabled) {
            log.info("[Dispatcher] WhatsApp Notifications are MUTED by Admin. Skipping notification to {}. WA Gateway session stays CONNECTED.", toPhoneNumber);
            return CompletableFuture.completedFuture(null);
        }

        String provider = notificationProvider != null ? notificationProvider.trim().toUpperCase() : "WHATSAPP_GATEWAY";

        switch (provider) {
            case "WHATSAPP_GATEWAY" -> {
                log.info("[Dispatcher] Sending via WhatsApp Gateway to {}", toPhoneNumber);
                sendViaGatewayWithSmsFallback(toPhoneNumber, message);
            }
            case "SMS" -> {
                log.info("[Dispatcher] Sending via SMS to {}", toPhoneNumber);
                fastSmsNotificationService.sendSms(toPhoneNumber, message);
            }
            case "WHATSAPP" -> {
                log.info("[Dispatcher] Sending via Meta WhatsApp API to {}", toPhoneNumber);
                whatsAppNotificationService.sendNotification(toPhoneNumber, message);
            }
            case "BOTH" -> {
                log.info("[Dispatcher] Sending via BOTH WhatsApp API and SMS to {}", toPhoneNumber);
                whatsAppNotificationService.sendNotification(toPhoneNumber, message);
                fastSmsNotificationService.sendSms(toPhoneNumber, message);
            }
            case "NONE", "OFF" -> log.info("[Dispatcher] Notifications OFF. Skipping for {}", toPhoneNumber);
            default -> {
                log.warn("[Dispatcher] Unknown provider '{}'. Defaulting to WhatsApp Gateway.", provider);
                sendViaGatewayWithSmsFallback(toPhoneNumber, message);
            }
        }

        return CompletableFuture.completedFuture(null);
    }

    /**
     * Primary: WhatsApp Gateway (Free, QR-based).
     * If QUEUED or ERROR from gateway AND SMS key is configured → send SMS fallback immediately.
     */
    private void sendViaGatewayWithSmsFallback(String toPhoneNumber, String message) {
        CompletableFuture<String> gatewayResult = whatsAppGatewayService.sendMessage(toPhoneNumber, message);
        gatewayResult.thenAccept(status -> {
            if ("ERROR".equals(status) || "NOT_CONFIGURED".equals(status)) {
                log.warn("[Dispatcher] Gateway returned {}. Triggering SMS fallback to {}", status, toPhoneNumber);
                fastSmsNotificationService.sendSms(toPhoneNumber, message);
            } else if ("QUEUED".equals(status)) {
                log.info("[Dispatcher] Message queued in gateway for {}. SMS fallback triggered for instant delivery.", toPhoneNumber);
                fastSmsNotificationService.sendSms(toPhoneNumber, message);
            }
            // "SENT" = WhatsApp delivered successfully, no fallback needed
        });
    }

    public Map<String, Object> testNotificationSync(String toPhoneNumber) {
        Map<String, Object> result = new HashMap<>();
        String provider = notificationProvider != null ? notificationProvider.trim().toUpperCase() : "WHATSAPP_GATEWAY";
        result.put("activeProviderConfig", provider);

        switch (provider) {
            case "WHATSAPP_GATEWAY" -> {
                result.put("gatewayStatus", whatsAppGatewayService.getStatus());
                result.put("smsTest", fastSmsNotificationService.sendSmsSync(toPhoneNumber, "Test Notification from Meals and Bowls"));
            }
            case "SMS" -> result.put("smsTest", fastSmsNotificationService.sendSmsSync(toPhoneNumber, "Test SMS from Meals and Bowls"));
            case "BOTH" -> {
                result.put("whatsAppTest", whatsAppNotificationService.testNotificationSync(toPhoneNumber));
                result.put("smsTest", fastSmsNotificationService.sendSmsSync(toPhoneNumber, "Test SMS from Meals and Bowls"));
            }
            default -> result.put("whatsAppTest", whatsAppNotificationService.testNotificationSync(toPhoneNumber));
        }

        return result;
    }
}
