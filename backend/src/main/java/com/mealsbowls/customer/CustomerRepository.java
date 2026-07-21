package com.mealsbowls.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, Long> {

    boolean existsByMobileNumber(String mobileNumber);
    
    Optional<Customer> findByMobileNumber(String mobileNumber);
    
    java.util.List<Customer> findByStatusOrderByCreatedAtDesc(CustomerStatus status);
    
    Page<Customer> findByStatus(CustomerStatus status, Pageable pageable);

    @Query("{ 'status': 'ACTIVE', '$or': [ { 'fullName': { '$regex': ?0, '$options': 'i' } }, { 'mobileNumber': { '$regex': ?0, '$options': 'i' } } ] }")
    Page<Customer> searchCustomers(String search, Pageable pageable);
}
