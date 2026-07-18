package com.mealsbowls.config;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.customer.CustomerStatus;
import com.mealsbowls.payment.Payment;
import com.mealsbowls.payment.PaymentRepository;
import com.mealsbowls.payment.PaymentStatus;
import com.mealsbowls.subscription.Plan;
import com.mealsbowls.subscription.PlanRepository;
import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionRepository;
import com.mealsbowls.subscription.SubscriptionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final PlanRepository planRepository;
    private final CustomerRepository customerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Plans
        Plan silver = null;
        Optional<Plan> silverOpt = planRepository.findByName("Silver");
        if (silverOpt.isEmpty()) {
            silver = new Plan();
            silver.setName("Silver");
            silver.setTotalMeals(30);
            silver.setValidityDays(35);
            silver.setPrice(2700.0);
            silver = planRepository.save(silver);
        } else {
            silver = silverOpt.get();
        }

        Plan gold = null;
        Optional<Plan> goldOpt = planRepository.findByName("Gold");
        if (goldOpt.isEmpty()) {
            gold = new Plan();
            gold.setName("Gold");
            gold.setTotalMeals(56);
            gold.setValidityDays(40);
            gold.setPrice(5000.0);
            gold = planRepository.save(gold);
        } else {
            gold = goldOpt.get();
        }

        // 2. Seed Customers, Subscriptions and Payments (if database is empty)
        if (customerRepository.count() == 0) {
            String defaultPassword = passwordEncoder.encode("password123");

            // Seed C001 to C020
            createDummyCustomer("Rahul Sharma", "9876543210", gold, 22, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Aman Patel", "9876543211", silver, 5, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Neha Verma", "9876543212", gold, 55, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Priya Singh", "9876543213", silver, 30, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Mohit Jain", "9876543214", gold, 18, SubscriptionStatus.EXPIRED, PaymentStatus.PAID, defaultPassword, 40);
            createDummyCustomer("Riya Gupta", "9876543215", silver, 10, SubscriptionStatus.ACTIVE, PaymentStatus.PENDING, defaultPassword, 5);
            createDummyCustomer("Karan Yadav", "9876543216", gold, 0, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Sneha Joshi", "9876543217", silver, 28, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Vivek Mishra", "9876543218", gold, 56, SubscriptionStatus.EXPIRED, PaymentStatus.PAID, defaultPassword, 40);
            createDummyCustomer("Pooja Shah", "9876543219", silver, 12, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Deepak Kumar", "9876543220", gold, 40, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Komal Soni", "9876543221", silver, 15, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Arjun Mehta", "9876543222", gold, 54, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Anjali Patel", "9876543223", silver, 2, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Nikhil Singh", "9876543224", gold, 31, SubscriptionStatus.ACTIVE, PaymentStatus.PENDING, defaultPassword, 5);
            createDummyCustomer("Aditi Sharma", "9876543225", silver, 0, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            // Expiring soon: Expires in 2 days
            createDummyCustomer("Saurabh Gupta", "9876543226", gold, 50, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 38);
            createDummyCustomer("Meera Jain", "9876543227", silver, 29, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Rohit Das", "9876543228", gold, 8, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
            createDummyCustomer("Kavya Nair", "9876543229", silver, 17, SubscriptionStatus.ACTIVE, PaymentStatus.PAID, defaultPassword, 5);
        }
    }

    private void createDummyCustomer(String fullName, String mobile, Plan plan, int consumed, 
                                     SubscriptionStatus subStatus, PaymentStatus payStatus, String encodedPassword, int startDaysAgo) {
        Customer customer = new Customer();
        customer.setFullName(fullName);
        customer.setMobileNumber(mobile);
        customer.setPassword(encodedPassword);
        customer.setPhotoUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + mobile);
        customer.setStatus(CustomerStatus.ACTIVE);
        customer = customerRepository.save(customer);

        Subscription sub = new Subscription();
        sub.setCustomer(customer);
        sub.setPlan(plan);
        sub.setMealsTotal(plan.getTotalMeals());
        sub.setMealsConsumed(consumed);
        sub.setStatus(subStatus);
        
        LocalDate startDate = LocalDate.now().minusDays(startDaysAgo);
        sub.setStartDate(startDate);
        sub.setExpiryDate(startDate.plusDays(plan.getValidityDays()));
        sub = subscriptionRepository.save(sub);

        Payment payment = new Payment();
        payment.setCustomer(customer);
        payment.setSubscription(sub);
        payment.setAmount(plan.getPrice());
        payment.setPaymentDate(startDate);
        payment.setStatus(payStatus);
        paymentRepository.save(payment);
    }
}
