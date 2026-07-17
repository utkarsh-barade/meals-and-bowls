package com.mealsbowls.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateCustomerRequest {
    
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Enter a valid 10-digit mobile number")
    private String mobileNumber;
}
