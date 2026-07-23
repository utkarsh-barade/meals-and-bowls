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

    @Value("${WHATSAPP_TEMPLATE_NAME:}")
    private String templateName;

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
            String cleanToken = apiToken != null ? apiToken.replaceAll("[\\r\\n\\s]+", "") : "";
            String cleanPhoneId = phoneNumberId != null ? phoneNumberId.replaceAll("[\\r\\n\\s]+", "") : "";
            String cleanTemplate = templateName != null ? templateName.replaceAll("[\\r\\n\\s]+", "") : "";

            if (cleanToken.isEmpty() || cleanPhoneId.isEmpty()) {
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

            String url = "https://graph.facebook.com/v19.0/" + cleanPhoneId + "/messages";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(cleanToken);

            Map<String, Object> body = new HashMap<>();
            body.put("messaging_product", "whatsapp");
            body.put("recipient_type", "individual");
            body.put("to", formattedNumber);

            if (!cleanTemplate.isEmpty()) {
                Map<String, Object> langObj = new HashMap<>();
                Map<String, Object> templateObj = new HashMap<>();
                templateObj.put("name", cleanTemplate);

                if (cleanTemplate.equalsIgnoreCase("hello_world")) {
                    langObj.put("code", "en_US");
                    templateObj.put("language", langObj);
                } else {
                    langObj.put("code", "en");
                    templateObj.put("language", langObj);

                    Map<String, Object> textParam = new HashMap<>();
                    textParam.put("type", "text");
                    textParam.put("parameter_name", "details");
                    textParam.put("text", message.length() > 1000 ? message.substring(0, 1000) : message);

                    Map<String, Object> bodyComp = new HashMap<>();
                    bodyComp.put("type", "body");
                    bodyComp.put("parameters", java.util.List.of(textParam));

                    templateObj.put("components", java.util.List.of(bodyComp));
                }

                body.put("type", "template");
                body.put("template", templateObj);
            } else {
                // Fallback to Free-Form Text Message (Works within 24-hour window)
                Map<String, Object> textObj = new HashMap<>();
                textObj.put("preview_url", false);
                textObj.put("body", message);

                body.put("type", "text");
                body.put("text", textObj);
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            try {
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("WhatsApp notification sent successfully to {}: {}", formattedNumber, response.getBody());
                } else {
                    log.error("Failed to send WhatsApp notification to {}. Status: {}, Response: {}", formattedNumber, response.getStatusCode(), response.getBody());
                }
            } catch (org.springframework.web.client.HttpStatusCodeException e) {
                log.error("Meta WhatsApp API error for {}: Status Code: {}, Error Body: {}", formattedNumber, e.getStatusCode(), e.getResponseBodyAsString());
            } catch (Exception e) {
                log.error("Error occurred while sending WhatsApp notification to {}: {}", formattedNumber, e.getMessage(), e);
            }
        });

        return CompletableFuture.completedFuture(null);
    }

    public Map<String, Object> testNotificationSync(String toPhoneNumber) {
        Map<String, Object> result = new HashMap<>();
        String cleanToken = apiToken != null ? apiToken.replaceAll("[\\r\\n\\s]+", "") : "";
        String cleanPhoneId = phoneNumberId != null ? phoneNumberId.replaceAll("[\\r\\n\\s]+", "") : "";
        String cleanTemplate = templateName != null ? templateName.replaceAll("[\\r\\n\\s]+", "") : "";

        result.put("tokenConfigured", !cleanToken.isEmpty());
        result.put("phoneIdConfigured", !cleanPhoneId.isEmpty());
        result.put("templateName", cleanTemplate);

        if (cleanToken.isEmpty() || cleanPhoneId.isEmpty()) {
            result.put("status", "ERROR");
            result.put("error", "WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID is missing on Render!");
            return result;
        }

        String formattedNumber = toPhoneNumber.replaceAll("[^0-9]", "");
        if (formattedNumber.length() == 10) {
            formattedNumber = "91" + formattedNumber;
        }
        result.put("targetNumber", formattedNumber);

        String url = "https://graph.facebook.com/v19.0/" + cleanPhoneId + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(cleanToken);

        Map<String, Object> body = new HashMap<>();
        body.put("messaging_product", "whatsapp");
        body.put("recipient_type", "individual");
        body.put("to", formattedNumber);

        if (!cleanTemplate.isEmpty()) {
            Map<String, Object> langObj = new HashMap<>();
            Map<String, Object> templateObj = new HashMap<>();
            templateObj.put("name", cleanTemplate);

            if (cleanTemplate.equalsIgnoreCase("hello_world")) {
                langObj.put("code", "en_US");
                templateObj.put("language", langObj);
            } else {
                langObj.put("code", "en");
                templateObj.put("language", langObj);

                Map<String, Object> textParam = new HashMap<>();
                textParam.put("type", "text");
                textParam.put("parameter_name", "details");
                textParam.put("text", "Test notification from Meals & Bowls");

                Map<String, Object> bodyComp = new HashMap<>();
                bodyComp.put("type", "body");
                bodyComp.put("parameters", java.util.List.of(textParam));

                templateObj.put("components", java.util.List.of(bodyComp));
            }

            body.put("type", "template");
            body.put("template", templateObj);
        } else {
            Map<String, Object> textObj = new HashMap<>();
            textObj.put("preview_url", false);
            textObj.put("body", "Test notification from Meals & Bowls");

            body.put("type", "text");
            body.put("text", textObj);
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            result.put("status", "SUCCESS");
            result.put("httpStatusCode", response.getStatusCode().value());
            result.put("metaResponseBody", response.getBody());
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            result.put("status", "META_API_ERROR");
            result.put("httpStatusCode", e.getStatusCode().value());
            result.put("metaResponseBody", e.getResponseBodyAsString());
        } catch (Exception e) {
            result.put("status", "EXCEPTION");
            result.put("exceptionMessage", e.getMessage());
        }

        return result;
    }

    public Map<String, Object> fetchMetaTemplates() {
        Map<String, Object> result = new HashMap<>();
        String cleanToken = apiToken != null ? apiToken.replaceAll("[\\r\\n\\s]+", "") : "";
        String cleanPhoneId = phoneNumberId != null ? phoneNumberId.replaceAll("[\\r\\n\\s]+", "") : "";

        if (cleanToken.isEmpty() || cleanPhoneId.isEmpty()) {
            result.put("error", "WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID is missing");
            return result;
        }

        String url = "https://graph.facebook.com/v19.0/998863066466456/message_templates?fields=name,status,language";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(cleanToken);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
            result.put("templatesMetaResponse", response.getBody());
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            result.put("metaError", e.getResponseBodyAsString());
        } catch (Exception e) {
            result.put("phoneError", e.getMessage());
        }

        return result;
    }
}
