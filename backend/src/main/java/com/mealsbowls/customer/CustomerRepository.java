package com.mealsbowls.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByMobileNumber(String mobileNumber);
    
    Optional<Customer> findByMobileNumber(String mobileNumber);
    
    java.util.List<Customer> findByStatusOrderByCreatedAtDesc(CustomerStatus status);
    
    Page<Customer> findByStatus(CustomerStatus status, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.status = 'ACTIVE' AND (" +
            "LOWER(c.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "c.mobileNumber LIKE CONCAT('%', :search, '%'))")
    Page<Customer> searchCustomers(@Param("search") String search, Pageable pageable);
}
