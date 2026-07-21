package com.mealsbowls.meal;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface MealAuditLogRepository extends MongoRepository<MealAuditLog, Long> {

    // Find logs for a specific customer, date and type — used in isCurrentlyServed check
    List<MealAuditLog> findByCustomerIdAndMealDateAndMealTypeOrderByCreatedAtDesc(Long customerId, LocalDate mealDate, MealType mealType);

    // Find all logs for a customer on a specific date — used in meal history (single date)
    List<MealAuditLog> findByCustomerIdAndMealDateOrderByCreatedAtDesc(Long customerId, LocalDate mealDate);

    // Find logs for a customer over a date range — used in meal history
    List<MealAuditLog> findByCustomerIdAndMealDateBetweenOrderByMealDateDesc(Long customerId, LocalDate startDate, LocalDate endDate);

    // Find today's served logs for the management board
    List<MealAuditLog> findByMealDateAndAction(LocalDate mealDate, MealAction action);

    long countByMealDateAndMealTypeAndAction(LocalDate mealDate, MealType mealType, MealAction action);

    List<MealAuditLog> findByCustomerIdAndActionOrderByMealDateDesc(Long customerId, MealAction action);

    // Find all logs for a customer — used in cascading delete
    List<MealAuditLog> findByCustomerId(Long customerId);

    // Delete all logs for a customer
    void deleteByCustomerId(Long customerId);
}
