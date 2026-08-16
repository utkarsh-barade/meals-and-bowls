package com.mealsbowls.subscription;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.exception.AppException;
import com.mealsbowls.notification.NotificationDispatcherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;
    private final CustomerRepository customerRepository;
    private final com.mealsbowls.payment.PaymentService paymentService;
    private final NotificationDispatcherService notificationService;
    private final com.mealsbowls.common.SequenceGeneratorService sequenceGeneratorService;

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Subscription assignPlan(Long customerId, AssignPlanRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));

        String planName;
        Double planPrice;
        int totalMeals;
        int validityDays;
        Long planId;

        if (Boolean.TRUE.equals(request.getIsCustom())) {
            if (request.getCustomName() == null || request.getCustomName().trim().isEmpty()) {
                throw new AppException("Custom plan name is required", HttpStatus.BAD_REQUEST);
            }
            if (request.getCustomTotalMeals() == null || request.getCustomTotalMeals() <= 0) {
                throw new AppException("Custom plan total meals must be greater than 0", HttpStatus.BAD_REQUEST);
            }
            if (request.getCustomValidityDays() == null || request.getCustomValidityDays() <= 0) {
                throw new AppException("Custom plan validity days must be greater than 0", HttpStatus.BAD_REQUEST);
            }
            if (request.getCustomPrice() == null || request.getCustomPrice() < 0) {
                throw new AppException("Custom plan price must be positive", HttpStatus.BAD_REQUEST);
            }
            
            planId = 0L; // placeholder for custom plan
            planName = request.getCustomName().trim();
            planPrice = request.getCustomPrice();
            totalMeals = request.getCustomTotalMeals();
            validityDays = request.getCustomValidityDays();
        } else {
            if (request.getPlanId() == null) {
                throw new AppException("Plan ID is required", HttpStatus.BAD_REQUEST);
            }
            Plan plan = planRepository.findById(request.getPlanId())
                    .orElseThrow(() -> new AppException("Plan not found", HttpStatus.NOT_FOUND));
            
            planId = plan.getId();
            planName = plan.getName();
            planPrice = plan.getPrice();
            totalMeals = plan.getTotalMeals();
            validityDays = plan.getValidityDays();
        }

        // Check for active subscription
        subscriptionRepository.findByCustomerIdAndStatus(customerId, SubscriptionStatus.ACTIVE)
                .ifPresent(sub -> {
                    throw new AppException("Customer already has an active subscription.", HttpStatus.CONFLICT);
                });

        // Check existing subscriptions for renewal detection
        List<Subscription> existingSubs = subscriptionRepository.findByCustomerId(customerId);
        boolean isRenewal = !existingSubs.isEmpty();

        Subscription subscription = new Subscription();
        subscription.setId(sequenceGeneratorService.generateSequence(Subscription.class.getSimpleName()));
        subscription.setCustomerId(customerId);
        subscription.setPlanId(planId);
        subscription.setPlanName(planName);
        subscription.setPlanPrice(planPrice);
        subscription.setStartDate(LocalDate.now());
        subscription.setExpiryDate(LocalDate.now().plusDays(validityDays));
        subscription.setMealsTotal(totalMeals);
        subscription.setMealsConsumed(0);
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        Subscription saved = subscriptionRepository.save(subscription);
        paymentService.createPendingPaymentForSubscription(saved, customer);
        
        String msg;
        if (isRenewal) {
            msg = "🎉 Meals & Bowls\n\n" +
                  "Hello " + customer.getFullName() + ",\n\n" +
                  "Your subscription has been renewed successfully.\n\n" +
                  "Plan: " + saved.getPlanName() + "\n" +
                  "Meals: " + saved.getMealsTotal() + "\n" +
                  "Valid Till: " + saved.getExpiryDate() + "\n\n" +
                  "Thank you for renewing with us.";
        } else {
            msg = "🎉 Welcome to Meals & Bowls\n\n" +
                  "Hello " + customer.getFullName() + ",\n\n" +
                  "Your subscription has been activated successfully.\n\n" +
                  "Plan: " + saved.getPlanName() + "\n" +
                  "Total Meals: " + saved.getMealsTotal() + "\n" +
                  "Start Date: " + saved.getStartDate() + "\n" +
                  "Expiry Date: " + saved.getExpiryDate() + "\n\n" +
                  "Enjoy your meals!";
        }
        
        notificationService.sendNotification(customer.getMobileNumber(), msg);
        
        return saved;
    }
    
    public Subscription getActiveSubscription(Long customerId) {
        return subscriptionRepository.findByCustomerIdAndStatus(customerId, SubscriptionStatus.ACTIVE)
                .orElse(null);
    }
}
