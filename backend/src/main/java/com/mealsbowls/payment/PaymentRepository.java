package com.mealsbowls.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p JOIN FETCH p.customer c LEFT JOIN FETCH p.subscription s LEFT JOIN FETCH s.plan WHERE p.customer.id = :customerId ORDER BY p.paymentDate DESC")
    List<Payment> findByCustomerIdOrderByPaymentDateDesc(@Param("customerId") Long customerId);

    @Query("SELECT p FROM Payment p JOIN FETCH p.customer c LEFT JOIN FETCH p.subscription s LEFT JOIN FETCH s.plan ORDER BY p.paymentDate DESC")
    List<Payment> findAllWithDetails();

    @Query("SELECT p FROM Payment p JOIN FETCH p.customer c LEFT JOIN FETCH p.subscription s LEFT JOIN FETCH s.plan WHERE p.status = 'PENDING' ORDER BY p.paymentDate DESC")
    List<Payment> findPendingWithDetails();

    // Sum of PAID payments for a specific date — used for today's collection dashboard card
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'PAID' AND p.paymentDate = :date")
    Double sumPaidAmountByDate(@Param("date") LocalDate date);
}

