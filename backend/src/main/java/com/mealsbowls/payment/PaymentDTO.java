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
        String planName = null;
        Long subscriptionId = null;
        if (p.getSubscription() != null) {
            subscriptionId = p.getSubscription().getId();
            if (p.getSubscription().getPlan() != null) {
                planName = p.getSubscription().getPlan().getName();
            }
        }
        return PaymentDTO.builder()
                .id(p.getId())
                .customerId(p.getCustomer().getId())
                .customerName(p.getCustomer().getFullName())
                .customerMobile(p.getCustomer().getMobileNumber())
                .subscriptionId(subscriptionId)
                .planName(planName)
                .amount(p.getAmount())
                .paymentDate(p.getPaymentDate())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
