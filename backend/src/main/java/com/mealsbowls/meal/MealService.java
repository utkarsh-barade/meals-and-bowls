package com.mealsbowls.meal;

import com.mealsbowls.common.SequenceGeneratorService;
import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.exception.AppException;
import com.mealsbowls.notification.WhatsAppNotificationService;
import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionRepository;
import com.mealsbowls.subscription.SubscriptionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealAuditLogRepository mealAuditLogRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final CustomerRepository customerRepository;
    private final WhatsAppNotificationService notificationService;
    private final SequenceGeneratorService sequenceGeneratorService;

    public List<com.mealsbowls.meal.dto.MealManagementCustomerDTO> getMealManagementList(String search) {
        LocalDate today = LocalDate.now();
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, 100);
        List<Customer> customers;
        if (search != null && !search.trim().isEmpty()) {
            customers = customerRepository.searchCustomers(search.trim(), pageable).getContent();
        } else {
            customers = customerRepository.findByStatus(com.mealsbowls.customer.CustomerStatus.ACTIVE, pageable).getContent();
        }

        List<Subscription> activeSubs = subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE);
        Map<Long, Subscription> subByCustomer = activeSubs.stream()
                .filter(s -> s.getCustomer() != null)
                .collect(Collectors.toMap(s -> s.getCustomer().getId(), s -> s, (s1, s2) -> s1));

        List<MealAuditLog> todayLogs = mealAuditLogRepository.findByMealDateAndAction(today, MealAction.SERVED);
        Map<Long, Set<MealType>> servedByCustomer = new HashMap<>();
        for (MealAuditLog log : todayLogs) {
            if (log.getCustomer() != null) {
                servedByCustomer.computeIfAbsent(log.getCustomer().getId(), k -> new HashSet<>()).add(log.getMealType());
            }
        }

        return customers.stream().map(c -> {
            Subscription sub = subByCustomer.get(c.getId());
            Set<MealType> servedTypes = servedByCustomer.getOrDefault(c.getId(), Collections.emptySet());

            com.mealsbowls.meal.dto.MealManagementCustomerDTO.MealManagementCustomerDTOBuilder builder =
                    com.mealsbowls.meal.dto.MealManagementCustomerDTO.builder()
                            .id(c.getId())
                            .fullName(c.getFullName())
                            .mobileNumber(c.getMobileNumber())
                            .photoUrl(c.getPhotoUrl())
                            .hasActiveSubscription(sub != null)
                            .lunchServed(servedTypes.contains(MealType.LUNCH))
                            .dinnerServed(servedTypes.contains(MealType.DINNER));

            if (sub != null && sub.getPlan() != null) {
                builder.planName(sub.getPlan().getName())
                        .mealsRemaining(sub.getMealsRemaining())
                        .mealsTotal(sub.getMealsTotal());
            }

            return builder.build();
        }).collect(Collectors.toList());
    }

    private boolean isCurrentlyServed(Long customerId, LocalDate date, MealType type) {
        List<MealAuditLog> logs = mealAuditLogRepository.findByCustomerIdAndMealDateAndMealTypeOrderByCreatedAtDesc(customerId, date, type);
        if (logs.isEmpty()) {
            return false;
        }
        MealAction latestAction = logs.get(0).getAction();
        return latestAction == MealAction.SERVED || latestAction == MealAction.CORRECTED_SERVED;
    }

    public void serveMeal(Long customerId, LocalDate date, MealType type) {
        Subscription activeSub = subscriptionRepository.findByCustomerIdAndStatus(customerId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new AppException("No active subscription found for this customer.", HttpStatus.UNPROCESSABLE_ENTITY));

        if (date.isAfter(activeSub.getExpiryDate()) || date.isBefore(activeSub.getStartDate())) {
            throw new AppException("Meal date is outside the active subscription validity period.", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (activeSub.getMealsRemaining() <= 0) {
            throw new AppException("No meals remaining in the active subscription.", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (isCurrentlyServed(customerId, date, type)) {
            throw new AppException("Meal has already been served for this date and type.", HttpStatus.CONFLICT);
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException("Customer not found.", HttpStatus.NOT_FOUND));

        MealAuditLog log = new MealAuditLog();
        log.setId(sequenceGeneratorService.generateSequence(MealAuditLog.class.getSimpleName()));
        log.setCustomer(customer);
        log.setSubscription(activeSub);
        log.setMealDate(date);
        log.setMealType(type);
        log.setAction(MealAction.SERVED);
        mealAuditLogRepository.save(log);

        activeSub.setMealsConsumed(activeSub.getMealsConsumed() + 1);
        if (activeSub.getMealsConsumed() >= activeSub.getMealsTotal()) {
            activeSub.setStatus(SubscriptionStatus.EXPIRED);
        }
        subscriptionRepository.save(activeSub);

        // Send served notification
        String timeStr = java.time.LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("hh:mm a"));
        String mealTypeStr = type.toString().substring(0, 1).toUpperCase() + type.toString().substring(1).toLowerCase();

        String msg = "🍽️ Meals & Bowls\n\n" +
                     "Hello " + customer.getFullName() + ",\n\n" +
                     "Your " + mealTypeStr + " has been served successfully.\n\n" +
                     "Date: " + date + "\n" +
                     "Time: " + timeStr + "\n\n" +
                     "Plan: " + activeSub.getPlan().getName() + "\n" +
                     "Remaining Meals: " + activeSub.getMealsRemaining() + " / " + activeSub.getMealsTotal() + "\n\n" +
                     "Thank you for choosing Meals & Bowls.";

        notificationService.sendNotification(customer.getMobileNumber(), msg);

        // Low balance alert — <= 3 meals remaining
        if (activeSub.getMealsRemaining() <= 3 && activeSub.getMealsRemaining() > 0) {
            String lowBalanceMsg = "⚠️ Meals & Bowls\n\n" +
                                   "Hello " + customer.getFullName() + ",\n\n" +
                                   "You have only " + activeSub.getMealsRemaining() + " meals remaining.\n\n" +
                                   "Please renew your subscription before your meals are exhausted.\n\n" +
                                   "Thank you.";
            notificationService.sendNotification(customer.getMobileNumber(), lowBalanceMsg);
        }
    }

    public void correctMeal(Long customerId, LocalDate date, MealType type, boolean markAsServed) {
        boolean currentlyServed = isCurrentlyServed(customerId, date, type);

        if (currentlyServed == markAsServed) {
            throw new AppException("Meal is already in the requested state.", HttpStatus.CONFLICT);
        }

        Subscription subToUpdate = subscriptionRepository.findByCustomerIdAndStatus(customerId, SubscriptionStatus.ACTIVE)
                .orElseGet(() -> {
                    List<MealAuditLog> logs = mealAuditLogRepository.findByCustomerIdAndMealDateAndMealTypeOrderByCreatedAtDesc(customerId, date, type);
                    if (!logs.isEmpty()) {
                        return logs.get(0).getSubscription();
                    }
                    throw new AppException("Cannot find subscription to correct.", HttpStatus.NOT_FOUND);
                });

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException("Customer not found.", HttpStatus.NOT_FOUND));

        MealAuditLog log = new MealAuditLog();
        log.setId(sequenceGeneratorService.generateSequence(MealAuditLog.class.getSimpleName()));
        log.setCustomer(customer);
        log.setSubscription(subToUpdate);
        log.setMealDate(date);
        log.setMealType(type);

        if (markAsServed) {
            if (subToUpdate.getMealsRemaining() <= 0) {
                throw new AppException("No meals remaining in the subscription to mark as served.", HttpStatus.UNPROCESSABLE_ENTITY);
            }
            log.setAction(MealAction.CORRECTED_SERVED);
            subToUpdate.setMealsConsumed(subToUpdate.getMealsConsumed() + 1);
            if (subToUpdate.getMealsConsumed() >= subToUpdate.getMealsTotal()) {
                subToUpdate.setStatus(SubscriptionStatus.EXPIRED);
            }
        } else {
            log.setAction(MealAction.CORRECTED_UNSERVED);
            if (subToUpdate.getMealsConsumed() > 0) {
                subToUpdate.setMealsConsumed(subToUpdate.getMealsConsumed() - 1);
            }
            if (subToUpdate.getStatus() == SubscriptionStatus.EXPIRED
                    && !LocalDate.now().isAfter(subToUpdate.getExpiryDate())) {
                subToUpdate.setStatus(SubscriptionStatus.ACTIVE);
            }
        }

        mealAuditLogRepository.save(log);

        String mealTypeStr = type.toString().substring(0, 1).toUpperCase() + type.toString().substring(1).toLowerCase();
        String correctionMsg = "🍽️ Meals & Bowls\n\n" +
                     "Hello " + customer.getFullName() + ",\n\n" +
                     "Your meal record has been updated by the administrator.\n\n" +
                     "Meal: " + mealTypeStr + "\n" +
                     "Date: " + date + "\n\n" +
                     "Remaining Meals: " + subToUpdate.getMealsRemaining() + " / " + subToUpdate.getMealsTotal() + "\n\n" +
                     "If you have any questions, please contact the mess office.";

        notificationService.sendNotification(customer.getMobileNumber(), correctionMsg);
        subscriptionRepository.save(subToUpdate);
    }

    public Map<LocalDate, DailyMealStatus> getMealHistory(Long customerId, LocalDate startDate, LocalDate endDate) {
        List<MealAuditLog> logs;
        if (startDate.equals(endDate)) {
            logs = mealAuditLogRepository.findByCustomerIdAndMealDateOrderByCreatedAtDesc(customerId, startDate);
        } else {
            logs = mealAuditLogRepository.findByCustomerIdAndMealDateBetweenOrderByMealDateDesc(customerId, startDate, endDate);
        }
        Map<LocalDate, DailyMealStatus> history = new HashMap<>();

        for (MealAuditLog log : logs) {
            history.putIfAbsent(log.getMealDate(), new DailyMealStatus(log.getMealDate(), false, false));
            DailyMealStatus status = history.get(log.getMealDate());

            // Logs are sorted by createdAt DESC — first log per date/type is the latest state
            if (log.getMealType() == MealType.LUNCH && !status.isLunchProcessed()) {
                status.setLunchServed(log.getAction() == MealAction.SERVED || log.getAction() == MealAction.CORRECTED_SERVED);
                status.setLunchProcessed(true);
            } else if (log.getMealType() == MealType.DINNER && !status.isDinnerProcessed()) {
                status.setDinnerServed(log.getAction() == MealAction.SERVED || log.getAction() == MealAction.CORRECTED_SERVED);
                status.setDinnerProcessed(true);
            }
        }
        return history;
    }
}
