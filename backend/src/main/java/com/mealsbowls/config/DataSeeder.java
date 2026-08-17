package com.mealsbowls.config;

import com.mealsbowls.common.SequenceGeneratorService;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PlanRepository planRepository;
    private final CustomerRepository customerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedPlans();
        seedOngoingCustomers();
    }

    private void seedPlans() {
        Optional<Plan> silverOpt = planRepository.findByName("Silver");
        if (silverOpt.isEmpty()) {
            Plan silver = new Plan();
            silver.setId(sequenceGeneratorService.generateSequence(Plan.class.getSimpleName()));
            silver.setName("Silver");
            silver.setTotalMeals(30);
            silver.setValidityDays(35);
            silver.setPrice(2700.0);
            planRepository.save(silver);
        }

        Optional<Plan> goldOpt = planRepository.findByName("Gold");
        if (goldOpt.isEmpty()) {
            Plan gold = new Plan();
            gold.setId(sequenceGeneratorService.generateSequence(Plan.class.getSimpleName()));
            gold.setName("Gold");
            gold.setTotalMeals(56);
            gold.setValidityDays(40);
            gold.setPrice(5000.0);
            planRepository.save(gold);
        }

        Optional<Plan> specialOpt = planRepository.findByName("Special");
        if (specialOpt.isEmpty()) {
            Plan special = new Plan();
            special.setId(sequenceGeneratorService.generateSequence(Plan.class.getSimpleName()));
            special.setName("Special");
            special.setTotalMeals(30);
            special.setValidityDays(35);
            special.setPrice(2500.0);
            planRepository.save(special);
        }
    }

    private void seedOngoingCustomers() {
        List<CustomerSeedData> list = List.of(
            new CustomerSeedData("Vadish Jain", "8817596297", "Gold", 4700.0, LocalDate.of(2026, 7, 10), 40, 58, 47, PaymentStatus.PAID),
            new CustomerSeedData("Yash Singh", "8965998340", "Silver", 2700.0, LocalDate.of(2026, 7, 16), 35, 30, 21, PaymentStatus.PAID),
            new CustomerSeedData("Adarsh Pawar", "8225802307", "Special", 2550.0, LocalDate.of(2026, 8, 17), 35, 30, 0, PaymentStatus.PENDING),
            new CustomerSeedData("Mahamrityunjay Singh", "7999015200", "Silver", 2700.0, LocalDate.of(2026, 8, 3), 35, 30, 9, PaymentStatus.PAID),
            new CustomerSeedData("Misthy Sahu", "9770472827", "Silver", 2700.0, LocalDate.of(2026, 7, 30), 35, 30, 14, PaymentStatus.PAID),
            new CustomerSeedData("Vipul Bhawsar", "7697579639", "Special", 2600.0, LocalDate.of(2026, 8, 15), 35, 30, 2, PaymentStatus.PAID),
            new CustomerSeedData("Nikita rajbhar", "9371006165", "Silver", 2700.0, LocalDate.of(2026, 8, 11), 35, 30, 6, PaymentStatus.PAID),
            new CustomerSeedData("Ritik Patidar", "9131383846", "Silver", 2700.0, LocalDate.of(2026, 8, 5), 35, 30, 10, PaymentStatus.PENDING),
            new CustomerSeedData("Gautam Patidar", "9131539504", "Silver", 2700.0, LocalDate.of(2026, 8, 6), 35, 30, 9, PaymentStatus.PENDING),
            new CustomerSeedData("Akshat Patidar", "9752138133", "Silver", 2700.0, LocalDate.of(2026, 8, 5), 35, 30, 8, PaymentStatus.PENDING),
            new CustomerSeedData("Vishal Patidar", "8817274213", "Special", 2500.0, LocalDate.of(2026, 8, 7), 35, 30, 12, PaymentStatus.PAID),
            new CustomerSeedData("Vipul Patidar", "7879840161", "Special", 2500.0, LocalDate.of(2026, 8, 6), 35, 30, 11, PaymentStatus.PENDING),
            new CustomerSeedData("Vimarsh Jain", "9399586446", "Special", 2500.0, LocalDate.of(2026, 8, 11), 35, 30, 5, PaymentStatus.PAID),
            new CustomerSeedData("Ayush Pathak", "9340536905", "Special", 2400.0, LocalDate.of(2026, 8, 9), 35, 30, 6, PaymentStatus.PAID),
            new CustomerSeedData("Sarthak Sanghai", "8109593397", "Silver", 2700.0, LocalDate.of(2026, 8, 1), 35, 30, 18, PaymentStatus.PAID),
            new CustomerSeedData("Demo Customer", "6265963117", "Silver", 2700.0, LocalDate.of(2026, 8, 17), 35, 30, 5, PaymentStatus.PAID)
        );

        for (CustomerSeedData item : list) {
            if (!customerRepository.existsByMobileNumber(item.mobile)) {
                String firstName = item.fullName.trim().split("\\s+")[0].toLowerCase();
                String rawPassword = firstName + "01";

                Customer customer = Customer.builder()
                        .id(sequenceGeneratorService.generateSequence(Customer.class.getSimpleName()))
                        .fullName(item.fullName)
                        .mobileNumber(item.mobile)
                        .password(passwordEncoder.encode(rawPassword))
                        .status(CustomerStatus.ACTIVE)
                        .build();
                Customer savedCustomer = customerRepository.save(customer);

                // Create Active Subscription
                Subscription subscription = new Subscription();
                subscription.setId(sequenceGeneratorService.generateSequence(Subscription.class.getSimpleName()));
                subscription.setCustomerId(savedCustomer.getId());
                subscription.setPlanId(0L);
                subscription.setPlanName(item.planName);
                subscription.setPlanPrice(item.price);
                subscription.setStartDate(item.startDate);
                subscription.setExpiryDate(item.startDate.plusDays(item.validityDays));
                subscription.setMealsTotal(item.mealsTotal);
                subscription.setMealsConsumed(item.mealsConsumed);
                subscription.setStatus(SubscriptionStatus.ACTIVE);
                Subscription savedSub = subscriptionRepository.save(subscription);

                // Create Payment record
                Payment payment = new Payment();
                payment.setId(sequenceGeneratorService.generateSequence(Payment.class.getSimpleName()));
                payment.setCustomerId(savedCustomer.getId());
                payment.setCustomerName(savedCustomer.getFullName());
                payment.setCustomerMobile(savedCustomer.getMobileNumber());
                payment.setSubscriptionId(savedSub.getId());
                payment.setPlanName(item.planName);
                payment.setAmount(item.price);
                payment.setPaymentDate(item.startDate);
                payment.setStatus(item.paymentStatus);
                paymentRepository.save(payment);

                log.info("[DataSeeder] Seeded customer: {} (Mobile: {}, Password: {})", item.fullName, item.mobile, rawPassword);
            }
        }
    }

    private static class CustomerSeedData {
        String fullName;
        String mobile;
        String planName;
        Double price;
        LocalDate startDate;
        int validityDays;
        int mealsTotal;
        int mealsConsumed;
        PaymentStatus paymentStatus;

        public CustomerSeedData(String fullName, String mobile, String planName, Double price,
                                LocalDate startDate, int validityDays, int mealsTotal, int mealsConsumed,
                                PaymentStatus paymentStatus) {
            this.fullName = fullName;
            this.mobile = mobile;
            this.planName = planName;
            this.price = price;
            this.startDate = startDate;
            this.validityDays = validityDays;
            this.mealsTotal = mealsTotal;
            this.mealsConsumed = mealsConsumed;
            this.paymentStatus = paymentStatus;
        }
    }
}
