package com.mealsbowls.customer;

import com.mealsbowls.common.ApiResponse;
import com.mealsbowls.customer.dto.CreateCustomerRequest;
import com.mealsbowls.customer.dto.CustomerDto;
import com.mealsbowls.customer.dto.UpdateCustomerRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CustomerDto>>> getCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomerDto> customers = customerService.getCustomers(search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Customers fetched successfully", customers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto>> getCustomerById(@PathVariable Long id) {
        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer fetched successfully", customer));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<java.util.List<CustomerDto>>> getPendingCustomers() {
        java.util.List<CustomerDto> pending = customerService.getPendingCustomers();
        return ResponseEntity.ok(ApiResponse.success("Pending customers fetched", pending));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<CustomerDto>> approveCustomer(@PathVariable Long id) {
        CustomerDto approved = customerService.approveCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer approved successfully", approved));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectCustomer(@PathVariable Long id) {
        customerService.rejectCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer request rejected", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerDto>> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        CustomerDto createdCustomer = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", createdCustomer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {
        CustomerDto updatedCustomer = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", updatedCustomer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully", null));
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<ApiResponse<CustomerDto>> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        CustomerDto updatedCustomer = customerService.uploadPhoto(id, file);
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded successfully", updatedCustomer));
    }
}
