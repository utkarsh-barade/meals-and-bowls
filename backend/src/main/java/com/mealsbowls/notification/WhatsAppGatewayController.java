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

    /**
     * GET /api/admin/whatsapp/status
     * Returns gateway connection status and QR code if disconnected.
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {
        Map<String, Object> status = whatsAppGatewayService.getStatus();
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("WhatsApp Gateway status fetched")
                .data(status)
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
}
