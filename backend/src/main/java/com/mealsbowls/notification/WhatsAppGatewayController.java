package com.mealsbowls.notification;

import com.mealsbowls.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/whatsapp")
@RequiredArgsConstructor
public class WhatsAppGatewayController {

    private final WhatsAppGatewayService whatsAppGatewayService;
    private final NotificationDispatcherService notificationDispatcherService;

    /**
     * GET /api/admin/whatsapp/status
     * Returns gateway connection status, QR code, and notifications toggle state.
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {
        Map<String, Object> status = whatsAppGatewayService.getStatus();
        status.put("notificationsEnabled", notificationDispatcherService.isNotificationsEnabled());
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("WhatsApp Gateway status fetched")
                .data(status)
                .build());
    }

    /**
     * POST /api/admin/whatsapp/toggle-notifications
     * Toggle WhatsApp notifications ON/OFF without disconnecting WhatsApp session.
     */
    @PostMapping("/toggle-notifications")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleNotifications(@RequestParam boolean enabled) {
        notificationDispatcherService.setNotificationsEnabled(enabled);
        Map<String, Object> data = Map.of(
                "notificationsEnabled", notificationDispatcherService.isNotificationsEnabled(),
                "message", enabled ? "WhatsApp notifications ENABLED" : "WhatsApp notifications MUTED (OFF)"
        );
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Notification toggle updated")
                .data(data)
                .build());
    }

    /**
     * POST /api/admin/whatsapp/flush-queue
     * Sends all queued messages now (call after reconnecting WhatsApp).
     */
    @PostMapping("/flush-queue")
    public ResponseEntity<ApiResponse<Map<String, Object>>> flushQueue() {
        Map<String, Object> result = whatsAppGatewayService.flushQueue();
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Queue flush triggered")
                .data(result)
                .build());
    }

    /**
     * POST /api/admin/whatsapp/reconnect
     * Clears session and generates a fresh QR Code immediately.
     */
    @PostMapping("/reconnect")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reconnect() {
        Map<String, Object> result = whatsAppGatewayService.reconnect();
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Fresh QR code request triggered")
                .data(result)
                .build());
    }
}
