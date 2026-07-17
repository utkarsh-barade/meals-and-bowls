package com.mealsbowls.payment;

import com.mealsbowls.common.ApiResponse;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentDTO>> recordPayment(@RequestBody RecordPaymentRequest request) {
        Payment payment = paymentService.recordPayment(
                request.getCustomerId(),
                request.getSubscriptionId(),
                request.getAmount(),
                request.getPaymentDate(),
                request.getStatus()
        );
        return ResponseEntity.ok(ApiResponse.success("Payment recorded successfully", PaymentDTO.from(payment)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PaymentDTO>> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus status
    ) {
        Payment payment = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated successfully", PaymentDTO.from(payment)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getCustomerPayments(@PathVariable Long customerId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByCustomer(customerId)
                .stream().map(PaymentDTO::from).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Customer payments retrieved successfully", payments));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPendingPayments() {
        List<PaymentDTO> payments = paymentService.getPendingPayments()
                .stream().map(PaymentDTO::from).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Pending payments retrieved successfully", payments));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments()
                .stream().map(PaymentDTO::from).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("All payments retrieved successfully", payments));
    }

    @Data
    public static class RecordPaymentRequest {
        @NotNull(message = "Customer ID is required")
        private Long customerId;
        private Long subscriptionId;
        @NotNull(message = "Amount is required")
        private Double amount;
        private LocalDate paymentDate;
        private PaymentStatus status;
    }
}
