package com.mealsbowls.customer;

import com.mealsbowls.common.ApiResponse;
import com.mealsbowls.customer.dto.CustomerDashboardDTO;
import com.mealsbowls.customer.dto.CustomerProfileDTO;
import com.mealsbowls.meal.DailyMealStatus;
import com.mealsbowls.meal.MealService;
import com.mealsbowls.payment.PaymentDTO;
import com.mealsbowls.payment.PaymentService;
import com.mealsbowls.subscription.Plan;
import com.mealsbowls.subscription.PlanDTO;
import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionDTO;
import com.mealsbowls.subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerPortalController {

    private final CustomerRepository customerRepository;
    private final SubscriptionService subscriptionService;
    private final MealService mealService;
    private final PaymentService paymentService;

    private Customer getAuthenticatedCustomer(Authentication authentication) {
        String mobile = authentication.getName();
        return customerRepository.findByMobileNumber(mobile)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Customer not found"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CustomerDashboardDTO>> getDashboard(Authentication authentication) {
        Customer customer = getAuthenticatedCustomer(authentication);
        
        Subscription activeSub = subscriptionService.getActiveSubscription(customer.getId());
        SubscriptionDTO subDto = null;
        if (activeSub != null) {
            subDto = mapToSubscriptionDTO(activeSub);
        }

        LocalDate today = LocalDate.now();
        Map<LocalDate, DailyMealStatus> history = mealService.getMealHistory(customer.getId(), today, today);
        DailyMealStatus todayStatus = history.getOrDefault(today, new DailyMealStatus(today, false, false));

        List<PaymentDTO> pendingPayments = paymentService.getPaymentsByCustomer(customer.getId())
                .stream()
                .filter(p -> p.getStatus() == com.mealsbowls.payment.PaymentStatus.PENDING)
                .map(PaymentDTO::from)
                .collect(Collectors.toList());

        CustomerDashboardDTO dashboard = CustomerDashboardDTO.builder()
                .activeSubscription(subDto)
                .todayMealStatus(todayStatus)
                .pendingPayments(pendingPayments)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved", dashboard));
    }

    @GetMapping("/meals")
    public ResponseEntity<ApiResponse<Map<LocalDate, DailyMealStatus>>> getMealHistory(Authentication authentication) {
        Customer customer = getAuthenticatedCustomer(authentication);
        // Show last 30 days
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(30);
        Map<LocalDate, DailyMealStatus> history = mealService.getMealHistory(customer.getId(), start, end);
        
        return ResponseEntity.ok(ApiResponse.success("Meal history retrieved", history));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerProfileDTO>> getProfile(Authentication authentication) {
        Customer customer = getAuthenticatedCustomer(authentication);
        
        CustomerProfileDTO profile = CustomerProfileDTO.builder()
                .fullName(customer.getFullName())
                .mobileNumber(customer.getMobileNumber())
                .photoUrl(customer.getPhotoUrl())
                .build();
                
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
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
