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
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final MealAuditLogRepository mealAuditLogRepository;
    private final com.mealsbowls.common.SequenceGeneratorService sequenceGeneratorService;
    private final com.mealsbowls.notification.NotificationDispatcherService notificationService;

    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:${FRONTEND_URL:http://localhost:5175}}")
    private String frontendUrl;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public Page<CustomerDto> getCustomers(String search, Pageable pageable) {
        Page<Customer> customers;
        if (search != null && !search.trim().isEmpty()) {
            customers = customerRepository.searchCustomers(search.trim(), pageable);
        } else {
            customers = customerRepository.findByStatus(CustomerStatus.ACTIVE, pageable);
        }
        return customers.map(c -> {
            CustomerDto dto = customerMapper.toDto(c);
            if (dto.getCreatedAt() == null) {
                dto.setCreatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt() : java.time.LocalDateTime.now());
            }
            return dto;
        });
    }
    
    public java.util.List<CustomerDto> getPendingCustomers() {
        return customerRepository.findByStatusOrderByCreatedAtDesc(CustomerStatus.PENDING)
                .stream()
                .map(c -> {
                    CustomerDto dto = customerMapper.toDto(c);
                    if (dto.getCreatedAt() == null) {
                        dto.setCreatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt() : java.time.LocalDateTime.now());
                    }
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));
        CustomerDto dto = customerMapper.toDto(customer);
        if (dto.getCreatedAt() == null) {
            dto.setCreatedAt(customer.getUpdatedAt() != null ? customer.getUpdatedAt() : java.time.LocalDateTime.now());
        }
        return dto;
    }

    public CustomerDto createCustomer(CreateCustomerRequest request) {
        if (customerRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new AppException("Mobile number already exists", HttpStatus.BAD_REQUEST);
        }

        Customer customer = customerMapper.toEntity(request);
        customer.setId(sequenceGeneratorService.generateSequence(Customer.class.getSimpleName()));
        customer.setPhotoUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getMobileNumber());
        customer.setStatus(CustomerStatus.ACTIVE);
        if (customer.getCreatedAt() == null) {
            customer.setCreatedAt(java.time.LocalDateTime.now());
        }
        customer = customerRepository.save(customer);
        CustomerDto dto = customerMapper.toDto(customer);
        if (dto.getCreatedAt() == null) {
            dto.setCreatedAt(java.time.LocalDateTime.now());
        }
        return dto;
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
        // Bulk deletion in MongoDB via single deleteMany queries (sub-millisecond)
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

    public void sendOnboardingNotification(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));

        com.mealsbowls.subscription.Subscription sub = subscriptionRepository.findByCustomerIdAndStatus(customer.getId(), com.mealsbowls.subscription.SubscriptionStatus.ACTIVE)
                .orElse(null);

        String planName = sub != null ? sub.getPlanName() : "Active Plan";
        int mealsTotal = sub != null ? sub.getMealsTotal() : 0;
        int mealsConsumed = sub != null ? sub.getMealsConsumed() : 0;
        int mealsRemaining = sub != null ? sub.getMealsRemaining() : 0;
        String startDate = sub != null && sub.getStartDate() != null ? sub.getStartDate().toString() : java.time.LocalDate.now().toString();
        String expiryDate = sub != null && sub.getExpiryDate() != null ? sub.getExpiryDate().toString() : java.time.LocalDate.now().plusDays(30).toString();

        String firstName = customer.getFullName().trim().split("\\s+")[0].toLowerCase();
        String password = firstName + "01";

        String baseLink = frontendUrl != null ? frontendUrl.split(",")[0].trim() : "http://localhost:5175";

        String msg = "🎉 *Welcome to Meals & Bowls!* 🍲\n\n" +
                "Hello *" + customer.getFullName() + "*,\n" +
                "Aapka account aur meal subscription successfully activate kar diya gaya hai!\n\n" +
                "📋 *Aapke Subscription Details:*\n" +
                "━━━━━━━━━━━━━━━━━━━━\n" +
                "📦 *Plan:* " + planName + "\n" +
                "🍲 *Total Meals:* " + mealsTotal + "\n" +
                "🍽️ *Meals Served:* " + mealsConsumed + "\n" +
                "🥗 *Meals Remaining:* " + mealsRemaining + "\n" +
                "📅 *Start Date:* " + startDate + "\n" +
                "⏳ *Valid Till:* " + expiryDate + "\n\n" +
                "🔐 *Aapke Login Credentials:*\n" +
                "━━━━━━━━━━━━━━━━━━━━\n" +
                "📱 *Mobile Number:* " + customer.getMobileNumber() + "\n" +
                "🔑 *Password:* " + password + "\n" +
                "🌐 *Login Portal:* " + baseLink + "/login\n\n" +
                "💡 *Dashboard par aap:*\n" +
                "• Daily meal history & consumption check kar sakte hain\n" +
                "• Remaining balance & validity track kar sakte hain\n\n" +
                "Enjoy your fresh home-style meals! 😋\n" +
                "*Support ke liye aap is number par reply kar sakte hain.*";

        notificationService.sendNotification(customer.getMobileNumber(), msg);
    }

    public int sendOnboardingNotificationToAll() {
        List<Customer> customers = customerRepository.findByStatusOrderByCreatedAtDesc(CustomerStatus.ACTIVE);
        int count = 0;
        for (Customer customer : customers) {
            try {
                sendOnboardingNotification(customer.getId());
                count++;
                Thread.sleep(1500); // 1.5s delay to prevent WhatsApp rate limits
            } catch (Exception e) {
                // proceed
            }
        }
        return count;
    }
}
