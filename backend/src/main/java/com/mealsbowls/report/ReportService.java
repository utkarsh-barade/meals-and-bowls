package com.mealsbowls.report;

import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.customer.CustomerStatus;
import com.mealsbowls.meal.MealAuditLog;
import com.mealsbowls.meal.MealAuditLogRepository;
import com.mealsbowls.meal.MealType;
import com.mealsbowls.payment.PaymentDTO;
import com.mealsbowls.payment.PaymentRepository;
import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionRepository;
import com.mealsbowls.subscription.SubscriptionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final CustomerRepository customerRepository;
    private final MealAuditLogRepository mealAuditLogRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;

    // --- Dashboard Stats ----------------------------------------------------

    public DashboardStatsDTO getDashboardStats() {
        LocalDate today = LocalDate.now();

        long totalCustomers  = customerRepository.count();
        long activeCustomers = subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE).size();
        long lunchToday      = mealAuditLogRepository.countByMealDateAndMealTypeAndActionServed(today, MealType.LUNCH);
        long dinnerToday     = mealAuditLogRepository.countByMealDateAndMealTypeAndActionServed(today, MealType.DINNER);
        long totalToday      = lunchToday + dinnerToday;

        long expiringSoon = subscriptionRepository
                .findExpiringBetween(today, today.plusDays(7)).size();

        Double collection = paymentRepository.sumPaidAmountByDate(today);
        double todaysCollection = (collection != null) ? collection : 0.0;

        return DashboardStatsDTO.builder()
                .totalCustomers(totalCustomers)
                .activeCustomers(activeCustomers)
                .lunchServedToday(lunchToday)
                .dinnerServedToday(dinnerToday)
                .totalMealsServedToday(totalToday)
                .plansExpiringSoon(expiringSoon)
                .todaysCollection(todaysCollection)
                .build();
    }

    // --- Daily Meal Report ---------------------------------------------------

    public List<DailyMealReportDTO> getDailyMealReport(LocalDate date) {
        List<MealAuditLog> logs = mealAuditLogRepository.findServedByDate(date);

        // Group by customer
        Map<Long, DailyMealReportDTO.DailyMealReportDTOBuilder> byCustomer = new LinkedHashMap<>();

        for (MealAuditLog log : logs) {
            Long cid = log.getCustomer().getId();
            DailyMealReportDTO.DailyMealReportDTOBuilder builder = byCustomer.computeIfAbsent(cid, k ->
                    DailyMealReportDTO.builder()
                            .customerId(cid)
                            .customerName(log.getCustomer().getFullName())
                            .customerMobile(log.getCustomer().getMobileNumber())
                            .mealDate(date)
                            .lunchServed(false)
                            .dinnerServed(false)
            );

            if (log.getMealType() == MealType.LUNCH)  builder.lunchServed(true);
            if (log.getMealType() == MealType.DINNER) builder.dinnerServed(true);
        }

        return byCustomer.values().stream()
                .map(b -> {
                    DailyMealReportDTO dto = b.build();
                    dto.setTotalMeals((dto.isLunchServed() ? 1 : 0) + (dto.isDinnerServed() ? 1 : 0));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // --- Customer Meal Report ------------------------------------------------

    public List<CustomerMealReportDTO> getCustomerMealReport(Long customerId) {
        return mealAuditLogRepository.findServedByCustomerId(customerId).stream()
                .map(log -> CustomerMealReportDTO.builder()
                        .logId(log.getId())
                        .mealDate(log.getMealDate())
                        .mealType(log.getMealType().name())
                        .action(log.getAction().name())
                        .servedAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // --- Expiring Plans ------------------------------------------------------

    public List<ExpiringPlanDTO> getExpiringPlans(int days) {
        LocalDate today = LocalDate.now();
        return subscriptionRepository.findExpiringBetween(today, today.plusDays(days)).stream()
                .map(s -> ExpiringPlanDTO.builder()
                        .subscriptionId(s.getId())
                        .customerId(s.getCustomer().getId())
                        .customerName(s.getCustomer().getFullName())
                        .customerMobile(s.getCustomer().getMobileNumber())
                        .planName(s.getPlan().getName())
                        .expiryDate(s.getExpiryDate())
                        .daysLeft(ChronoUnit.DAYS.between(today, s.getExpiryDate()))
                        .mealsRemaining(s.getMealsRemaining())
                        .build())
                .collect(Collectors.toList());
    }

    // --- Pending Payments ----------------------------------------------------

    public List<PaymentDTO> getPendingPayments() {
        return paymentRepository.findPendingWithDetails().stream()
                .map(PaymentDTO::from)
                .collect(Collectors.toList());
    }
}
