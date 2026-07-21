package com.mealsbowls.payment;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, Long> {

    List<Payment> findByCustomerIdOrderByPaymentDateDesc(Long customerId);

    List<Payment> findAllByOrderByPaymentDateDesc();

    List<Payment> findByStatusOrderByPaymentDateDesc(PaymentStatus status);

    List<Payment> findByStatusAndPaymentDate(PaymentStatus status, LocalDate paymentDate);

    void deleteByCustomerId(Long customerId);
}
