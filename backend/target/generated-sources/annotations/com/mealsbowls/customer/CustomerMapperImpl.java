package com.mealsbowls.customer;

import com.mealsbowls.customer.dto.CreateCustomerRequest;
import com.mealsbowls.customer.dto.CustomerDto;
import com.mealsbowls.customer.dto.UpdateCustomerRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-17T17:28:27+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public CustomerDto toDto(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        CustomerDto.CustomerDtoBuilder customerDto = CustomerDto.builder();

        customerDto.createdAt( customer.getCreatedAt() );
        customerDto.fullName( customer.getFullName() );
        customerDto.id( customer.getId() );
        customerDto.mobileNumber( customer.getMobileNumber() );
        customerDto.photoUrl( customer.getPhotoUrl() );
        if ( customer.getStatus() != null ) {
            customerDto.status( customer.getStatus().name() );
        }
        customerDto.updatedAt( customer.getUpdatedAt() );

        return customerDto.build();
    }

    @Override
    public Customer toEntity(CreateCustomerRequest request) {
        if ( request == null ) {
            return null;
        }

        Customer.CustomerBuilder customer = Customer.builder();

        customer.fullName( request.getFullName() );
        customer.mobileNumber( request.getMobileNumber() );

        return customer.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateCustomerRequest request, Customer customer) {
        if ( request == null ) {
            return;
        }

        customer.setFullName( request.getFullName() );
        customer.setMobileNumber( request.getMobileNumber() );
    }
}
