package com.mealsbowls.customer;

import com.mealsbowls.customer.dto.CreateCustomerRequest;
import com.mealsbowls.customer.dto.CustomerDto;
import com.mealsbowls.customer.dto.UpdateCustomerRequest;
import com.mealsbowls.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mealsbowls.meal.MealAuditLogRepository;
import com.mealsbowls.payment.PaymentRepository;
import com.mealsbowls.subscription.SubscriptionRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final MealAuditLogRepository mealAuditLogRepository;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @Transactional(readOnly = true)
    public Page<CustomerDto> getCustomers(String search, Pageable pageable) {
        Page<Customer> customers;
        if (search != null && !search.trim().isEmpty()) {
            customers = customerRepository.searchCustomers(search.trim(), pageable);
        } else {
            customers = customerRepository.findByStatus(CustomerStatus.ACTIVE, pageable);
        }
        return customers.map(customerMapper::toDto);
    }
    
    @Transactional(readOnly = true)
    public java.util.List<CustomerDto> getPendingCustomers() {
        return customerRepository.findByStatusOrderByCreatedAtDesc(CustomerStatus.PENDING)
                .stream()
                .map(customerMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));
        return customerMapper.toDto(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CreateCustomerRequest request) {
        if (customerRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new AppException("Mobile number already exists", HttpStatus.BAD_REQUEST);
        }

        Customer customer = customerMapper.toEntity(request);
        customer.setPhotoUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getMobileNumber());
        customer.setStatus(CustomerStatus.ACTIVE);
        customer = customerRepository.save(customer);
        return customerMapper.toDto(customer);
    }

    @Transactional
    public CustomerDto updateCustomer(Long id, UpdateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));

        if (!customer.getMobileNumber().equals(request.getMobileNumber()) &&
                customerRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new AppException("Mobile number already exists", HttpStatus.BAD_REQUEST);
        }

        customerMapper.updateEntityFromRequest(request, customer);
        customer = customerRepository.save(customer);
        return customerMapper.toDto(customer);
    }

    @Transactional
    public CustomerDto approveCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));
        if (customer.getStatus() == CustomerStatus.ACTIVE) {
            throw new AppException("Customer is already active", HttpStatus.BAD_REQUEST);
        }
        customer.setStatus(CustomerStatus.ACTIVE);
        customer = customerRepository.save(customer);
        return customerMapper.toDto(customer);
    }

    @Transactional
    public void rejectCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));
        if (customer.getStatus() == CustomerStatus.ACTIVE) {
            throw new AppException("Cannot reject an active customer", HttpStatus.BAD_REQUEST);
        }
        deleteRelatedEntities(id);
        customerRepository.delete(customer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));
        deleteRelatedEntities(id);
        customerRepository.delete(customer);
    }

    private void deleteRelatedEntities(Long customerId) {
        mealAuditLogRepository.deleteByCustomerId(customerId);
        paymentRepository.deleteByCustomerId(customerId);
        subscriptionRepository.deleteByCustomerId(customerId);
    }

    @Transactional
    public CustomerDto uploadPhoto(Long id, MultipartFile file) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));

        if (file.isEmpty()) {
            throw new AppException("Please select a file to upload", HttpStatus.BAD_REQUEST);
        }

        try {
            Files.createDirectories(this.fileStorageLocation);

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();

            customer.setPhotoUrl(fileDownloadUri);
            customer = customerRepository.save(customer);

            return customerMapper.toDto(customer);

        } catch (IOException ex) {
            throw new AppException("Could not store file. Please try again!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
