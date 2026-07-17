package com.mealsbowls.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {
    private Long id;
    private String fullName;
    private String mobileNumber;
    private String photoUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
