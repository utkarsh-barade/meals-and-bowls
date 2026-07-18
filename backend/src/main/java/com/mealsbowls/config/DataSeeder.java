package com.mealsbowls.config;

import com.mealsbowls.subscription.Plan;
import com.mealsbowls.subscription.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final PlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed Plans if database is empty
        Optional<Plan> silverOpt = planRepository.findByName("Silver");
        if (silverOpt.isEmpty()) {
            Plan silver = new Plan();
            silver.setName("Silver");
            silver.setTotalMeals(30);
            silver.setValidityDays(35);
            silver.setPrice(2700.0);
            planRepository.save(silver);
        }

        Optional<Plan> goldOpt = planRepository.findByName("Gold");
        if (goldOpt.isEmpty()) {
            Plan gold = new Plan();
            gold.setName("Gold");
            gold.setTotalMeals(56);
            gold.setValidityDays(40);
            gold.setPrice(5000.0);
            planRepository.save(gold);
        }
    }
}
