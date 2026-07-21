package com.mealsbowls.subscription;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PlanRepository extends MongoRepository<Plan, Long> {
    Optional<Plan> findByName(String name);
}
