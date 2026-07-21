package com.mealsbowls.meal;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface MealAuditLogRepository extends MongoRepository<MealAuditLog, Long> {

    @Query(value = "{ 'customer.$id': ?0, 'mealDate': ?1, 'mealType': ?2 }", sort = "{ 'createdAt': -1 }")
    List<MealAuditLog> findByCustomerIdAndMealDateAndMealTypeOrderByCreatedAtDesc(Long customerId, LocalDate mealDate, MealType mealType);

    @Query(value = "{ 'customer.$id': ?0, 'mealDate': ?1 }", sort = "{ 'createdAt': -1 }")
    List<MealAuditLog> findByCustomerIdAndMealDateOrderByCreatedAtDesc(Long customerId, LocalDate mealDate);

    @Query(value = "{ 'customer.$id': ?0, 'mealDate': { '$gte': ?1, '$lte': ?2 } }", sort = "{ 'mealDate': -1 }")
    List<MealAuditLog> findByCustomerIdAndMealDateBetweenOrderByMealDateDesc(Long customerId, LocalDate startDate, LocalDate endDate);

    long countByMealDateAndMealTypeAndAction(LocalDate mealDate, MealType mealType, MealAction action);

    List<MealAuditLog> findByMealDateAndAction(LocalDate mealDate, MealAction action);

    @Query(value = "{ 'customer.$id': ?0, 'action': ?1 }", sort = "{ 'mealDate': -1 }")
    List<MealAuditLog> findByCustomerIdAndActionOrderByMealDateDesc(Long customerId, MealAction action);

    @Query(value = "{ 'customer.$id': ?0 }", delete = true)
    void deleteByCustomerId(Long customerId);
}
