package com.mealsbowls.subscription;

import com.mealsbowls.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<PlanDTO>>> getPlans() {
        List<PlanDTO> plans = subscriptionService.getAllPlans().stream()
                .map(this::mapToPlanDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Plans fetched successfully", plans));
    }

    @PostMapping("/customers/{customerId}/subscriptions")
    public ResponseEntity<ApiResponse<SubscriptionDTO>> assignPlan(
            @PathVariable Long customerId,
            @Valid @RequestBody AssignPlanRequest request) {
        Subscription subscription = subscriptionService.assignPlan(customerId, request.getPlanId());
        return ResponseEntity.ok(ApiResponse.success("Plan assigned successfully", mapToSubscriptionDTO(subscription)));
    }
    
    @GetMapping("/customers/{customerId}/subscriptions/active")
    public ResponseEntity<ApiResponse<SubscriptionDTO>> getActiveSubscription(@PathVariable Long customerId) {
        Subscription subscription = subscriptionService.getActiveSubscription(customerId);
        if (subscription == null) {
            return ResponseEntity.ok(ApiResponse.success("No active subscription", null));
        }
        return ResponseEntity.ok(ApiResponse.success("Active subscription fetched", mapToSubscriptionDTO(subscription)));
    }

    private PlanDTO mapToPlanDTO(Plan plan) {
        PlanDTO dto = new PlanDTO();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setTotalMeals(plan.getTotalMeals());
        dto.setValidityDays(plan.getValidityDays());
        dto.setPrice(plan.getPrice());
        return dto;
    }

    private SubscriptionDTO mapToSubscriptionDTO(Subscription sub) {
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(sub.getId());
        dto.setCustomerId(sub.getCustomerId());

        PlanDTO planDto = new PlanDTO();
        planDto.setId(sub.getPlanId());
        planDto.setName(sub.getPlanName());
        planDto.setPrice(sub.getPlanPrice());
        planDto.setTotalMeals(sub.getMealsTotal());
        dto.setPlan(planDto);

        dto.setStartDate(sub.getStartDate());
        dto.setExpiryDate(sub.getExpiryDate());
        dto.setMealsTotal(sub.getMealsTotal());
        dto.setMealsConsumed(sub.getMealsConsumed());
        dto.setMealsRemaining(sub.getMealsRemaining());
        dto.setStatus(sub.getStatus().name());
        return dto;
    }
}
