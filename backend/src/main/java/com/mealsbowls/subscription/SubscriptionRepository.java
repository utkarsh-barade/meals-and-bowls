package com.mealsbowls.subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByCustomerIdAndStatus(Long customerId, SubscriptionStatus status);
    List<Subscription> findByStatus(SubscriptionStatus status);
    List<Subscription> findByCustomerId(Long customerId);

    // Plans expiring within a date window — for reports and dashboard card
    @Query("SELECT s FROM Subscription s JOIN FETCH s.customer JOIN FETCH s.plan WHERE s.status = 'ACTIVE' AND s.expiryDate BETWEEN :from AND :to ORDER BY s.expiryDate ASC")
    List<Subscription> findExpiringBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);
}

