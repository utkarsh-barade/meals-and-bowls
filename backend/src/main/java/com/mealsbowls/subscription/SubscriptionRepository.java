package com.mealsbowls.subscription;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends MongoRepository<Subscription, Long> {

    Optional<Subscription> findByCustomerIdAndStatus(Long customerId, SubscriptionStatus status);

    List<Subscription> findByStatus(SubscriptionStatus status);

    List<Subscription> findByCustomerId(Long customerId);

    @Query("{ 'status': 'ACTIVE', 'expiryDate': { '$gte': ?0, '$lte': ?1 } }")
    List<Subscription> findExpiringBetween(LocalDate from, LocalDate to);

    void deleteByCustomerId(Long customerId);
}
