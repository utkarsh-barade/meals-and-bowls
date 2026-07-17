package com.mealsbowls.meal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MealAuditLogRepository extends JpaRepository<MealAuditLog, Long> {

    @Query("SELECT m FROM MealAuditLog m WHERE m.customer.id = :customerId AND m.mealDate = :date AND m.mealType = :type ORDER BY m.createdAt DESC")
    List<MealAuditLog> findLogsByCustomerAndDateAndType(@Param("customerId") Long customerId, @Param("date") LocalDate date, @Param("type") MealType type);

    @Query("SELECT m FROM MealAuditLog m WHERE m.customer.id = :customerId AND m.mealDate BETWEEN :startDate AND :endDate ORDER BY m.mealDate DESC, m.createdAt DESC")
    List<MealAuditLog> findLogsForMonth(@Param("customerId") Long customerId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Count by date and meal type — used for dashboard today stats
    @Query("SELECT COUNT(m) FROM MealAuditLog m WHERE m.mealDate = :date AND m.mealType = :type AND m.action = 'SERVED'")
    long countByMealDateAndMealTypeAndActionServed(@Param("date") LocalDate date, @Param("type") MealType type);

    // All SERVED logs for a given date — daily meal report
    @Query("SELECT m FROM MealAuditLog m JOIN FETCH m.customer WHERE m.mealDate = :date AND m.action = 'SERVED' ORDER BY m.customer.fullName, m.mealType")
    List<MealAuditLog> findServedByDate(@Param("date") LocalDate date);

    // All SERVED logs for a customer — customer meal report
    @Query("SELECT m FROM MealAuditLog m WHERE m.customer.id = :customerId AND m.action = 'SERVED' ORDER BY m.mealDate DESC, m.mealType")
    List<MealAuditLog> findServedByCustomerId(@Param("customerId") Long customerId);
    void deleteByCustomerId(Long customerId);
}
