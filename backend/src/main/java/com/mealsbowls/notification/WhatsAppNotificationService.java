package com.mealsbowls.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ForkJoinPool;

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

    public WhatsAppNotificationService(RestTemplateBuilder restTemplateBuilder) {
        // Set strict 2-second timeouts so it never blocks the system
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(2))
                .setReadTimeout(Duration.ofSeconds(2))
                .build();
    }

    @Async
    public CompletableFuture<Void> sendNotification(String toPhoneNumber, String message) {
        // Run in a background thread completely separate from the request thread
        CompletableFuture.runAsync(() -> {
            if (apiToken == null || apiToken.isEmpty() || phoneNumberId == null || phoneNumberId.isEmpty()) {
                log.warn("WhatsApp API credentials are not configured. Skipping notification to {}: {}", toPhoneNumber, message);
                return;
            }

            String targetNumber = toPhoneNumber;
            if (testNumber != null && !testNumber.trim().isEmpty()) {
                log.info("Overriding recipient {} with test number {}", toPhoneNumber, testNumber);
                targetNumber = testNumber;
            }

            String formattedNumber = targetNumber.replaceAll("[^0-9]", "");
            if (formattedNumber.length() == 10) {
                formattedNumber = "91" + formattedNumber;
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
                // Background delay (1s) to respect Meta rate limits without blocking backend requests
                Thread.sleep(1000);
                
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("WhatsApp notification sent successfully to {}", formattedNumber);
                } else {
                    log.error("Failed to send WhatsApp notification. Status: {}, Response: {}", response.getStatusCode(), response.getBody());
                }
            } catch (Exception e) {
                log.error("Error occurred while sending WhatsApp notification to {}: {}", formattedNumber, e.getMessage());
            }
        });

        return CompletableFuture.completedFuture(null);
    }
}
