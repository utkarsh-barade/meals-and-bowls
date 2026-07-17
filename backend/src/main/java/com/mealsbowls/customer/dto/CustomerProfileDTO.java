package com.mealsbowls.customer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerProfileDTO {
    private String fullName;
    private String mobileNumber;
    private String photoUrl;
}
