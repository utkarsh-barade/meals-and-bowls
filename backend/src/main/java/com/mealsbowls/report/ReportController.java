package com.mealsbowls.report;

import com.mealsbowls.common.ApiResponse;
import com.mealsbowls.payment.PaymentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /** GET /api/admin/reports/dashboard */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", reportService.getDashboardStats()));
    }

    /** GET /api/admin/reports/daily-meals?date=2025-01-17 */
    @GetMapping("/daily-meals")
    public ResponseEntity<ApiResponse<List<DailyMealReportDTO>>> getDailyMeals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ResponseEntity.ok(ApiResponse.success("Daily meal report retrieved", reportService.getDailyMealReport(date)));
    }

    /** GET /api/admin/reports/customer-meals/{customerId} */
    @GetMapping("/customer-meals/{customerId}")
    public ResponseEntity<ApiResponse<List<CustomerMealReportDTO>>> getCustomerMeals(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success("Customer meal report retrieved", reportService.getCustomerMealReport(customerId)));
    }

    /** GET /api/admin/reports/expiring-plans?days=7 */
    @GetMapping("/expiring-plans")
    public ResponseEntity<ApiResponse<List<ExpiringPlanDTO>>> getExpiringPlans(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(ApiResponse.success("Expiring plans retrieved", reportService.getExpiringPlans(days)));
    }

    /** GET /api/admin/reports/pending-payments */
    @GetMapping("/pending-payments")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPendingPayments() {
        return ResponseEntity.ok(ApiResponse.success("Pending payments retrieved", reportService.getPendingPayments()));
    }
}
