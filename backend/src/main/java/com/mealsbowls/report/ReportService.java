package com.mealsbowls.report;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.meal.MealAction;
import com.mealsbowls.meal.MealAuditLog;
import com.mealsbowls.meal.MealAuditLogRepository;
import com.mealsbowls.meal.MealType;
import com.mealsbowls.payment.PaymentDTO;
import com.mealsbowls.payment.PaymentRepository;
import com.mealsbowls.payment.PaymentStatus;
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
        long lunchToday      = mealAuditLogRepository.countByMealDateAndMealTypeAndAction(today, MealType.LUNCH, MealAction.SERVED);
        long dinnerToday     = mealAuditLogRepository.countByMealDateAndMealTypeAndAction(today, MealType.DINNER, MealAction.SERVED);
        long totalToday      = lunchToday + dinnerToday;

        long expiringSoon = subscriptionRepository
                .findExpiringBetween(today, today.plusDays(7)).size();

        double todaysCollection = paymentRepository.findByStatusAndPaymentDate(PaymentStatus.PAID, today)
                .stream()
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();

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
        List<MealAuditLog> logs = mealAuditLogRepository.findByMealDateAndAction(date, MealAction.SERVED);

        // Fetch customer details in one query
        Set<Long> customerIds = logs.stream().map(MealAuditLog::getCustomerId).filter(Objects::nonNull).collect(Collectors.toSet());
        Map<Long, Customer> customerMap = customerRepository.findAllById(customerIds).stream()
                .collect(Collectors.toMap(Customer::getId, c -> c));

        // Group by customer
        Map<Long, DailyMealReportDTO.DailyMealReportDTOBuilder> byCustomer = new LinkedHashMap<>();

        for (MealAuditLog log : logs) {
            Long cid = log.getCustomerId();
            if (cid == null) continue;

            Customer customer = customerMap.get(cid);
            String name = customer != null ? customer.getFullName() : "Unknown";
            String mobile = customer != null ? customer.getMobileNumber() : "";

            DailyMealReportDTO.DailyMealReportDTOBuilder builder = byCustomer.computeIfAbsent(cid, k ->
                    DailyMealReportDTO.builder()
                            .customerId(cid)
                            .customerName(name)
                            .customerMobile(mobile)
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
        return mealAuditLogRepository.findByCustomerIdAndActionOrderByMealDateDesc(customerId, MealAction.SERVED).stream()
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
        List<com.mealsbowls.subscription.Subscription> subs = subscriptionRepository.findExpiringBetween(today, today.plusDays(days));

        Set<Long> customerIds = subs.stream().map(com.mealsbowls.subscription.Subscription::getCustomerId).filter(Objects::nonNull).collect(Collectors.toSet());
        Map<Long, Customer> customerMap = customerRepository.findAllById(customerIds).stream()
                .collect(Collectors.toMap(Customer::getId, c -> c));

        return subs.stream()
                .map(s -> {
                    Customer c = customerMap.get(s.getCustomerId());
                    return ExpiringPlanDTO.builder()
                            .subscriptionId(s.getId())
                            .customerId(s.getCustomerId())
                            .customerName(c != null ? c.getFullName() : "Unknown")
                            .customerMobile(c != null ? c.getMobileNumber() : "")
                            .planName(s.getPlanName())
                            .expiryDate(s.getExpiryDate())
                            .daysLeft(ChronoUnit.DAYS.between(today, s.getExpiryDate()))
                            .mealsRemaining(s.getMealsRemaining())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // --- Pending Payments ----------------------------------------------------

    public List<PaymentDTO> getPendingPayments() {
        return paymentRepository.findByStatusOrderByPaymentDateDesc(PaymentStatus.PENDING).stream()
                .map(PaymentDTO::from)
                .collect(Collectors.toList());
    }
}
