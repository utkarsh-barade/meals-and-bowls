package com.mealsbowls.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Mobile number is required.")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number.")
    private String mobile;

    @NotBlank(message = "Password is required.")
    private String password;
}
