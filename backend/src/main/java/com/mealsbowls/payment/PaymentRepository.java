package com.mealsbowls.payment;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, Long> {

    @Query(value = "{ 'customer.$id': ?0 }", sort = "{ 'paymentDate': -1 }")
    List<Payment> findByCustomerIdOrderByPaymentDateDesc(Long customerId);

    List<Payment> findAllByOrderByPaymentDateDesc();

    List<Payment> findByStatusOrderByPaymentDateDesc(PaymentStatus status);

    List<Payment> findByStatusAndPaymentDate(PaymentStatus status, LocalDate paymentDate);

    @Query(value = "{ 'customer.$id': ?0 }", delete = true)
    void deleteByCustomerId(Long customerId);
}
