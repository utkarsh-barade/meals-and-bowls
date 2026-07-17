package com.mealsbowls.auth;

import com.mealsbowls.auth.dto.AuthResponse;
import com.mealsbowls.auth.dto.LoginRequest;
import com.mealsbowls.auth.dto.RegisterRequest;
import com.mealsbowls.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Thin auth controller — delegates all logic to AuthService.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Admin login endpoint. */
    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful.", response));
    }

    /** Customer login endpoint. */
    @PostMapping("/customer/login")
    public ResponseEntity<ApiResponse<AuthResponse>> customerLogin(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.customerLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful.", response));
    }

    /** Customer self-registration. Submits a registration request for admin approval. */
    @PostMapping("/customer/register")
    public ResponseEntity<ApiResponse<AuthResponse>> customerRegister(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.customerRegister(request);
        return ResponseEntity.ok(ApiResponse.success("Registration request submitted. Pending admin approval.", response));
    }
}
