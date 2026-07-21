package com.mealsbowls.payment;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.subscription.Subscription;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
public class Payment {

    @Id
    private Long id;

    @DBRef
    private Customer customer;

    @DBRef
    private Subscription subscription;

    private Double amount;

    private LocalDate paymentDate;

    private PaymentStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
