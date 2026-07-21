package com.mealsbowls.meal;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface MealAuditLogRepository extends MongoRepository<MealAuditLog, Long> {

    List<MealAuditLog> findByCustomerIdAndMealDateAndMealTypeOrderByCreatedAtDesc(Long customerId, LocalDate mealDate, MealType mealType);

    List<MealAuditLog> findByCustomerIdAndMealDateBetweenOrderByMealDateDesc(Long customerId, LocalDate startDate, LocalDate endDate);

    long countByMealDateAndMealTypeAndAction(LocalDate mealDate, MealType mealType, MealAction action);

    List<MealAuditLog> findByMealDateAndAction(LocalDate mealDate, MealAction action);

    List<MealAuditLog> findByCustomerIdAndActionOrderByMealDateDesc(Long customerId, MealAction action);

    void deleteByCustomerId(Long customerId);
}
