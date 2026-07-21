package com.mealsbowls.subscription;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends MongoRepository<Subscription, Long> {
    
    @Query("{ 'customer.$id': ?0, 'status': ?1 }")
    Optional<Subscription> findByCustomerIdAndStatus(Long customerId, SubscriptionStatus status);

    List<Subscription> findByStatus(SubscriptionStatus status);

    @Query("{ 'customer.$id': ?0 }")
    List<Subscription> findByCustomerId(Long customerId);

    @Query(value = "{ 'status': 'ACTIVE', 'expiryDate': { '$gte': ?0, '$lte': ?1 } }", sort = "{ 'expiryDate': 1 }")
    List<Subscription> findExpiringBetween(LocalDate from, LocalDate to);

    @Query(value = "{ 'customer.$id': ?0 }", delete = true)
    void deleteByCustomerId(Long customerId);
}
