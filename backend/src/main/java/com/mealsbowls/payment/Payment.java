package com.mealsbowls.payment;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "payments")
@CompoundIndex(name = "customer_payment_date", def = "{'customerId': 1, 'paymentDate': -1}")
@Data
public class Payment {

    @Id
    private Long id;

    // Flat ID reference — no @DBRef, no extra round-trip
    @Indexed
    private Long customerId;

    // Embedded customer info needed for display
    private String customerName;
    private String customerMobile;

    // Flat subscription ID reference
    private Long subscriptionId;

    // Embedded plan name for display
    private String planName;

    private Double amount;

    private LocalDate paymentDate;

    private PaymentStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
