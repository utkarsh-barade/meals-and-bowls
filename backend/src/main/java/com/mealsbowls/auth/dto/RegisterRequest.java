package com.mealsbowls.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Full name is required.")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters.")
    private String fullName;

    @NotBlank(message = "Mobile number is required.")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number.")
    private String mobile;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters.")
    private String password;

    @NotBlank(message = "Please confirm your password.")
    private String confirmPassword;
}
