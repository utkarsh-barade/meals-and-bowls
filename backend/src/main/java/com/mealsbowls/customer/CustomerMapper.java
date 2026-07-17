package com.mealsbowls.customer;

import com.mealsbowls.customer.dto.CreateCustomerRequest;
import com.mealsbowls.customer.dto.CustomerDto;
import com.mealsbowls.customer.dto.UpdateCustomerRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    CustomerDto toDto(Customer customer);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Customer toEntity(CreateCustomerRequest request);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UpdateCustomerRequest request, @MappingTarget Customer customer);
}
