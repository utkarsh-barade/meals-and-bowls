package com.mealsbowls.auth;

import com.mealsbowls.auth.dto.AuthResponse;
import com.mealsbowls.auth.dto.LoginRequest;
import com.mealsbowls.auth.dto.RegisterRequest;
import com.mealsbowls.common.Role;
import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerStatus;
import com.mealsbowls.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * Auth business logic — credential validation, token generation.
 * Database integration will be wired in once customer/user entities are built.
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final com.mealsbowls.customer.CustomerRepository customerRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final com.mealsbowls.common.SequenceGeneratorService sequenceGeneratorService;

    @Value("${app.admin.mobile}")
    private String adminMobile;

    @Value("${app.admin.password}")
    private String adminPassword;

    /** Admin login — credentials validated against env-based config properties. */
    public AuthResponse adminLogin(LoginRequest request) {
        if (adminMobile.equals(request.getMobile()) && adminPassword.equals(request.getPassword())) {
            return buildResponse(adminMobile, Role.ADMIN, "System Admin");
        }
        throw new AppException("Admin account not found or invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    /**
     * Customer login.
     */
    public AuthResponse customerLogin(LoginRequest request) {
        Customer customer = customerRepository.findByMobileNumber(request.getMobile())
                .orElseThrow(() -> new AppException("Customer account not found or invalid credentials.", HttpStatus.UNAUTHORIZED));
                
        if (customer.getStatus() != CustomerStatus.ACTIVE) {
            throw new AppException("Account pending admin approval.", HttpStatus.FORBIDDEN);
        }
                
        if (customer.getPassword() == null || !passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new AppException("Customer account not found or invalid credentials.", HttpStatus.UNAUTHORIZED);
        }
        
        return buildResponse(customer.getMobileNumber(), Role.CUSTOMER, customer.getFullName());
    }

    /**
     * Customer self-registration.
     * Per PRD FR-013: mobile must already exist in the system (admin-created record).
     */
    public AuthResponse customerRegister(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Passwords do not match.", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        
        java.util.Optional<Customer> existingOpt = customerRepository.findByMobileNumber(request.getMobile());
        if (existingOpt.isPresent()) {
            Customer existing = existingOpt.get();
            if (existing.getStatus() == CustomerStatus.ACTIVE) {
                throw new AppException("Account already registered. Please log in.", HttpStatus.BAD_REQUEST);
            } else if (existing.getStatus() == CustomerStatus.PENDING) {
                throw new AppException("Request already pending. Please wait for admin approval.", HttpStatus.BAD_REQUEST);
            } else {
                // Was rejected before, allow re-registration
                existing.setStatus(CustomerStatus.PENDING);
                existing.setFullName(request.getFullName());
                existing.setPassword(passwordEncoder.encode(request.getPassword()));
                existing.setPhotoUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getMobile());
                customerRepository.save(existing);
                return null;
            }
        }
        
        Customer customer = Customer.builder()
                .id(sequenceGeneratorService.generateSequence(Customer.class.getSimpleName()))
                .fullName(request.getFullName())
                .mobileNumber(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .photoUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getMobile())
                .status(CustomerStatus.PENDING)
                .build();
                
        customerRepository.save(customer);
        
        // Return null instead of a token since they can't login yet
        return null;
    }

    // --- Internal helper (will be used once DB is wired) ---

    protected AuthResponse buildResponse(String mobile, Role role, String fullName) {
        String token = jwtService.generateToken(mobile, role, fullName);
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .role(role)
                .name(fullName)
                .mobile(mobile)
                .build();
    }
}
