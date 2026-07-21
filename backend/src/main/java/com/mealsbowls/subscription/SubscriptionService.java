package com.mealsbowls.subscription;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.exception.AppException;
import com.mealsbowls.notification.WhatsAppNotificationService;
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
    private final WhatsAppNotificationService notificationService;
    private final com.mealsbowls.common.SequenceGeneratorService sequenceGeneratorService;

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Subscription assignPlan(Long customerId, Long planId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new AppException("Plan not found", HttpStatus.NOT_FOUND));

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
        subscription.setPlanName(plan.getName());
        subscription.setPlanPrice(plan.getPrice());
        subscription.setStartDate(LocalDate.now());
        subscription.setExpiryDate(LocalDate.now().plusDays(plan.getValidityDays()));
        subscription.setMealsTotal(plan.getTotalMeals());
        subscription.setMealsConsumed(0);
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        Subscription saved = subscriptionRepository.save(subscription);
        paymentService.createPendingPaymentForSubscription(saved, customer);
        
        String msg;
        if (isRenewal) {
            msg = "🎉 Meals & Bowls\n\n" +
                  "Hello " + customer.getFullName() + ",\n\n" +
                  "Your subscription has been renewed successfully.\n\n" +
                  "Plan: " + plan.getName() + "\n" +
                  "Meals: " + plan.getTotalMeals() + "\n" +
                  "Valid Till: " + saved.getExpiryDate() + "\n\n" +
                  "Thank you for renewing with us.";
        } else {
            msg = "🎉 Welcome to Meals & Bowls\n\n" +
                  "Hello " + customer.getFullName() + ",\n\n" +
                  "Your subscription has been activated successfully.\n\n" +
                  "Plan: " + plan.getName() + "\n" +
                  "Total Meals: " + plan.getTotalMeals() + "\n" +
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
