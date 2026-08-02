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

@Service
@Slf4j
public class FastSmsNotificationService {

    private final RestTemplate restTemplate;

    @Value("${app.notification.fast2sms-api-key:${FAST2SMS_API_KEY:}}")
    private String apiKey;

    public FastSmsNotificationService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(3))
                .setReadTimeout(Duration.ofSeconds(3))
                .build();
    }

    @Async
    public CompletableFuture<Void> sendSms(String toPhoneNumber, String message) {
        CompletableFuture.runAsync(() -> {
            sendSmsSync(toPhoneNumber, message);
        });
        return CompletableFuture.completedFuture(null);
    }

    public Map<String, Object> sendSmsSync(String toPhoneNumber, String message) {
        Map<String, Object> result = new HashMap<>();

        String cleanApiKey = apiKey != null ? apiKey.replaceAll("[\\r\\n\\s]+", "") : "";
        if (cleanApiKey.isEmpty()) {
            log.warn("Fast2SMS API Key (FAST2SMS_API_KEY) is not configured. Skipping SMS to {}: {}", toPhoneNumber, message);
            result.put("status", "SKIPPED");
            result.put("reason", "FAST2SMS_API_KEY missing");
            return result;
        }

        String formattedNumber = toPhoneNumber.replaceAll("[^0-9]", "");
        if (formattedNumber.length() > 10) {
            formattedNumber = formattedNumber.substring(formattedNumber.length() - 10);
        }

        // Fast2SMS Quick SMS API URL (POST JSON with authorization header)
        String url = "https://www.fast2sms.com/dev/bulkV2";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("authorization", cleanApiKey);
        headers.set("User-Agent", "Mozilla/5.0");

        // Clean message string (remove special non-ASCII characters for Fast2SMS compatibility)
        String cleanMsg = message.replaceAll("[^\\x00-\\x7F]", "").trim();

        Map<String, Object> body = new HashMap<>();
        body.put("route", "q"); // Quick SMS route
        body.put("message", cleanMsg);
        body.put("language", "english");
        body.put("flash", "0");
        body.put("numbers", formattedNumber);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("SMS sent successfully via Fast2SMS to {}: {}", formattedNumber, response.getBody());
                result.put("status", "SUCCESS");
                result.put("response", response.getBody());
            } else {
                log.error("Failed to send SMS to {}. Status: {}, Response: {}", formattedNumber, response.getStatusCode(), response.getBody());
                result.put("status", "FAILED");
                result.put("response", response.getBody());
            }
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("Fast2SMS API error for {}: Status Code: {}, Error Body: {}", formattedNumber, e.getStatusCode(), e.getResponseBodyAsString());
            result.put("status", "API_ERROR");
            result.put("error", e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error occurred while sending SMS to {}: {}", formattedNumber, e.getMessage(), e);
            result.put("status", "EXCEPTION");
            result.put("error", e.getMessage());
        }

        return result;
    }
}
