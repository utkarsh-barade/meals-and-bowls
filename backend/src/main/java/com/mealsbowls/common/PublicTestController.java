package com.mealsbowls.common;

import com.mealsbowls.notification.NotificationDispatcherService;
import com.mealsbowls.notification.WhatsAppNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicTestController {

    private final NotificationDispatcherService notificationService;
    private final WhatsAppNotificationService whatsAppNotificationService;

    @RequestMapping(value = "/health", method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "meals-bowls-api",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/test/notification")
    public ResponseEntity<Map<String, Object>> testNotification(@RequestParam(defaultValue = "9999999999") String phone) {
        Map<String, Object> response = notificationService.testNotificationSync(phone);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test/meta-info")
    public ResponseEntity<Map<String, Object>> metaInfo() {
        return ResponseEntity.ok(whatsAppNotificationService.fetchMetaTemplates());
    }
}
