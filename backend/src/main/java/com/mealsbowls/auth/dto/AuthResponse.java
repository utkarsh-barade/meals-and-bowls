package com.mealsbowls.auth.dto;

import com.mealsbowls.common.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private Role role;
    private String name;
    private String mobile;
}
