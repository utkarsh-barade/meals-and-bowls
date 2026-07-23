package com.mealsbowls.common;

import com.mealsbowls.notification.WhatsAppNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicTestController {

    private final WhatsAppNotificationService whatsAppNotificationService;

    @GetMapping("/test-whatsapp")
    public ResponseEntity<Map<String, Object>> testWhatsApp(@RequestParam(defaultValue = "7049592280") String phone) {
        Map<String, Object> response = whatsAppNotificationService.testNotificationSync(phone);
        return ResponseEntity.ok(response);
    }
}
