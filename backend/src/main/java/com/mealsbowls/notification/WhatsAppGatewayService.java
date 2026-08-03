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
public class WhatsAppGatewayService {

    private final RestTemplate restTemplate;

    @Value("${app.wa-gateway.url:${WA_GATEWAY_URL:}}")
    private String gatewayUrl;

    @Value("${app.wa-gateway.api-key:${WA_GATEWAY_API_KEY:meals-bowls-secret}}")
    private String apiKey;

    public WhatsAppGatewayService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(4))
                .setReadTimeout(Duration.ofSeconds(6))
                .build();
    }

    /**
     * Returns true if gateway is reachable AND WhatsApp is connected.
     */
    public boolean isConnected() {
        if (gatewayUrl == null || gatewayUrl.isBlank()) return false;
        try {
            String url = gatewayUrl.stripTrailing() + "/status";
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", apiKey.trim());
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object connected = response.getBody().get("connected");
                return Boolean.TRUE.equals(connected);
            }
        } catch (Exception e) {
            log.warn("[WA-Gateway] Status check failed: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Sends a WhatsApp message via the gateway.
     * Returns "SENT", "QUEUED", or "ERROR".
     */
    @Async
    public CompletableFuture<String> sendMessage(String toPhone, String message) {
        if (gatewayUrl == null || gatewayUrl.isBlank()) {
            log.warn("[WA-Gateway] WA_GATEWAY_URL is not configured. Skipping.");
            return CompletableFuture.completedFuture("NOT_CONFIGURED");
        }

        try {
            String url = gatewayUrl.stripTrailing() + "/send";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey.trim());

            Map<String, Object> body = new HashMap<>();
            body.put("to", toPhone);
            body.put("message", message);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode().value() == 202) {
                log.info("[WA-Gateway] Message QUEUED for {} (WA disconnected)", toPhone);
                return CompletableFuture.completedFuture("QUEUED");
            }

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("[WA-Gateway] Message SENT via WhatsApp to {}", toPhone);
                return CompletableFuture.completedFuture("SENT");
            }

        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("[WA-Gateway] HTTP error sending to {}: {} {}", toPhone, e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("[WA-Gateway] Error sending to {}: {}", toPhone, e.getMessage());
        }

        return CompletableFuture.completedFuture("ERROR");
    }

    /**
     * Proxy for /status endpoint (for Admin Panel QR display).
     */
    public Map<String, Object> getStatus() {
        Map<String, Object> result = new HashMap<>();
        if (gatewayUrl == null || gatewayUrl.isBlank()) {
            result.put("configured", false);
            result.put("connected", false);
            result.put("error", "WA_GATEWAY_URL is not set");
            return result;
        }

        try {
            String url = gatewayUrl.stripTrailing() + "/status";
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", apiKey.trim());
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            if (response.getBody() != null) {
                result.putAll(response.getBody());
            }
            result.put("configured", true);
        } catch (Exception e) {
            result.put("configured", true);
            result.put("connected", false);
            result.put("error", "Gateway unreachable: " + e.getMessage());
        }
        return result;
    }

    /**
     * Proxy for /flush-queue endpoint.
     */
    public Map<String, Object> flushQueue() {
        Map<String, Object> result = new HashMap<>();
        if (gatewayUrl == null || gatewayUrl.isBlank()) {
            result.put("error", "WA_GATEWAY_URL is not set");
            return result;
        }

        try {
            String url = gatewayUrl.stripTrailing() + "/flush-queue";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey.trim());
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);
            if (response.getBody() != null) {
                result.putAll(response.getBody());
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        return result;
    }
}
