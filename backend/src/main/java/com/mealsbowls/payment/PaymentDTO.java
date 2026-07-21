package com.mealsbowls.payment;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerMobile;
    private Long subscriptionId;
    private String planName;
    private Double amount;
    private LocalDate paymentDate;
    private PaymentStatus status;
    private LocalDateTime createdAt;

    public static PaymentDTO from(Payment p) {
        return PaymentDTO.builder()
                .id(p.getId())
                .customerId(p.getCustomerId())
                .customerName(p.getCustomerName())
                .customerMobile(p.getCustomerMobile())
                .subscriptionId(p.getSubscriptionId())
                .planName(p.getPlanName())
                .amount(p.getAmount())
                .paymentDate(p.getPaymentDate())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
