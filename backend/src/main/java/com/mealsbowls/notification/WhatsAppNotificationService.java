package com.mealsbowls.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class WhatsAppNotificationService {

    private final RestTemplate restTemplate;

    @Value("${WHATSAPP_API_TOKEN:}")
    private String apiToken;

    @Value("${WHATSAPP_PHONE_NUMBER_ID:}")
    private String phoneNumberId;

    @Value("${app.whatsapp.test-number:}")
    private String testNumber;

    public WhatsAppNotificationService() {
        this.restTemplate = new RestTemplate();
    }

    @Async
    public CompletableFuture<Void> sendNotification(String toPhoneNumber, String message) {
        if (apiToken == null || apiToken.isEmpty() || phoneNumberId == null || phoneNumberId.isEmpty()) {
            log.warn("WhatsApp API credentials are not configured. Skipping notification to {}: {}", toPhoneNumber, message);
            return CompletableFuture.completedFuture(null);
        }

        // Check if a global test/override number is set
        String targetNumber = toPhoneNumber;
        if (testNumber != null && !testNumber.trim().isEmpty()) {
            log.info("Overriding recipient {} with test number {}", toPhoneNumber, testNumber);
            targetNumber = testNumber;
        }

        // Format phone number (must include country code without '+')
        String formattedNumber = targetNumber.replaceAll("[^0-9]", "");
        if (formattedNumber.length() == 10) {
            formattedNumber = "91" + formattedNumber; // Assuming India for demonstration
        }

        String url = "https://graph.facebook.com/v17.0/" + phoneNumberId + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiToken);

        Map<String, Object> textObj = new HashMap<>();
        textObj.put("preview_url", false);
        textObj.put("body", message);

        Map<String, Object> body = new HashMap<>();
        body.put("messaging_product", "whatsapp");
        body.put("recipient_type", "individual");
        body.put("to", formattedNumber);
        body.put("type", "text");
        body.put("text", textObj);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            // Add a small 1-second delay to prevent Meta's Sandbox from collapsing on concurrent messages
            Thread.sleep(1000);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("WhatsApp notification sent successfully to {}", formattedNumber);
            } else {
                log.error("Failed to send WhatsApp notification. Status: {}, Response: {}", response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            // Do not throw so the business transaction is not rolled back
            log.error("Error occurred while sending WhatsApp notification to {}: {}", formattedNumber, e.getMessage());
        }
        
        return CompletableFuture.completedFuture(null);
    }
}
