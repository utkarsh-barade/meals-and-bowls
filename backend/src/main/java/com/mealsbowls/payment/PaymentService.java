package com.mealsbowls.payment;

import com.mealsbowls.common.SequenceGeneratorService;
import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.exception.AppException;
import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public Payment recordPayment(Long customerId, Long subscriptionId, Double amount, LocalDate date, PaymentStatus status) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException("Customer not found", HttpStatus.NOT_FOUND));

        Subscription subscription = null;
        if (subscriptionId != null) {
            subscription = subscriptionRepository.findById(subscriptionId)
                    .orElseThrow(() -> new AppException("Subscription not found", HttpStatus.NOT_FOUND));
        }

        Payment payment = new Payment();
        payment.setId(sequenceGeneratorService.generateSequence(Payment.class.getSimpleName()));
        payment.setCustomer(customer);
        payment.setSubscription(subscription);
        payment.setAmount(amount);
        payment.setPaymentDate(date != null ? date : LocalDate.now());
        payment.setStatus(status != null ? status : PaymentStatus.PAID);

        return paymentRepository.save(payment);
    }

    public Payment createPendingPaymentForSubscription(Subscription subscription) {
        Payment payment = new Payment();
        payment.setId(sequenceGeneratorService.generateSequence(Payment.class.getSimpleName()));
        payment.setCustomer(subscription.getCustomer());
        payment.setSubscription(subscription);
        payment.setAmount(subscription.getPlan().getPrice());
        payment.setPaymentDate(subscription.getStartDate() != null ? subscription.getStartDate() : LocalDate.now());
        payment.setStatus(PaymentStatus.PENDING);

        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException("Payment not found", HttpStatus.NOT_FOUND));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByCustomer(Long customerId) {
        return paymentRepository.findByCustomerIdOrderByPaymentDateDesc(customerId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc();
    }

    public List<Payment> getPendingPayments() {
        return paymentRepository.findByStatusOrderByPaymentDateDesc(PaymentStatus.PENDING);
    }
}
