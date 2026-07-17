package com.mealsbowls.meal;

import com.mealsbowls.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    /** POST /api/admin/meals/serve/{customerId} */
    @PostMapping("/serve/{customerId}")
    public ResponseEntity<ApiResponse<Void>> serveMeal(
            @PathVariable Long customerId,
            @Valid @RequestBody ServeMealRequest request) {
        mealService.serveMeal(customerId, request.getDate(), request.getMealType());
        return ResponseEntity.ok(ApiResponse.success("Meal served successfully", null));
    }

    /** POST /api/admin/meals/correct/{customerId} */
    @PostMapping("/correct/{customerId}")
    public ResponseEntity<ApiResponse<Void>> correctMeal(
            @PathVariable Long customerId,
            @Valid @RequestBody CorrectMealRequest request) {
        mealService.correctMeal(customerId, request.getDate(), request.getMealType(), request.getIsServed());
        return ResponseEntity.ok(ApiResponse.success("Meal history corrected", null));
    }

    /** GET /api/admin/meals/history/{customerId}?startDate=&endDate= */
    @GetMapping("/history/{customerId}")
    public ResponseEntity<ApiResponse<Map<LocalDate, DailyMealStatus>>> getHistory(
            @PathVariable Long customerId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        Map<LocalDate, DailyMealStatus> history = mealService.getMealHistory(customerId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Meal history fetched", history));
    }
}
