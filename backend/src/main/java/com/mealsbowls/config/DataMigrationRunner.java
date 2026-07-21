package com.mealsbowls.config;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.meal.MealAuditLog;
import com.mealsbowls.meal.MealAuditLogRepository;
import com.mealsbowls.payment.Payment;
import com.mealsbowls.payment.PaymentRepository;
import com.mealsbowls.subscription.Plan;
import com.mealsbowls.subscription.PlanRepository;
import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataMigrationRunner implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final SubscriptionRepository subscriptionRepository;
    private final MealAuditLogRepository mealAuditLogRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;

    @Override
    public void run(String... args) {
        try {
            log.info("Checking for legacy DBRef documents in MongoDB to migrate...");
            migrateSubscriptions();
            migrateMealLogs();
            migratePayments();
            log.info("MongoDB data migration check complete.");
        } catch (Exception e) {
            log.error("Error during data migration check", e);
        }
    }

    private void migrateSubscriptions() {
        List<Document> rawSubs = mongoTemplate.find(new Query(), Document.class, "subscriptions");
        for (Document doc : rawSubs) {
            boolean updated = false;
            Long id = doc.getLong("_id");
            if (id == null) continue;

            Subscription sub = subscriptionRepository.findById(id).orElse(null);
            if (sub == null) continue;

            if (sub.getCustomerId() == null && doc.get("customer") instanceof Document) {
                Document customerRef = (Document) doc.get("customer");
                Object cid = customerRef.get("$id");
                if (cid instanceof Number) {
                    sub.setCustomerId(((Number) cid).longValue());
                    updated = true;
                }
            }

            if (sub.getPlanId() == null && doc.get("plan") instanceof Document) {
                Document planRef = (Document) doc.get("plan");
                Object pid = planRef.get("$id");
                if (pid instanceof Number) {
                    Long planId = ((Number) pid).longValue();
                    sub.setPlanId(planId);
                    planRepository.findById(planId).ifPresent(p -> {
                        sub.setPlanName(p.getName());
                        sub.setPlanPrice(p.getPrice());
                    });
                    updated = true;
                }
            }

            if (updated) {
                subscriptionRepository.save(sub);
                log.info("Migrated Subscription ID {}", id);
            }
        }
    }

    private void migrateMealLogs() {
        List<Document> rawLogs = mongoTemplate.find(new Query(), Document.class, "meal_audit_logs");
        for (Document doc : rawLogs) {
            boolean updated = false;
            Long id = doc.getLong("_id");
            if (id == null) continue;

            MealAuditLog logItem = mealAuditLogRepository.findById(id).orElse(null);
            if (logItem == null) continue;

            if (logItem.getCustomerId() == null && doc.get("customer") instanceof Document) {
                Document customerRef = (Document) doc.get("customer");
                Object cid = customerRef.get("$id");
                if (cid instanceof Number) {
                    logItem.setCustomerId(((Number) cid).longValue());
                    updated = true;
                }
            }

            if (logItem.getSubscriptionId() == null && doc.get("subscription") instanceof Document) {
                Document subRef = (Document) doc.get("subscription");
                Object sid = subRef.get("$id");
                if (sid instanceof Number) {
                    logItem.setSubscriptionId(((Number) sid).longValue());
                    updated = true;
                }
            }

            if (updated) {
                mealAuditLogRepository.save(logItem);
                log.info("Migrated MealAuditLog ID {}", id);
            }
        }
    }

    private void migratePayments() {
        List<Document> rawPayments = mongoTemplate.find(new Query(), Document.class, "payments");
        for (Document doc : rawPayments) {
            boolean updated = false;
            Long id = doc.getLong("_id");
            if (id == null) continue;

            Payment p = paymentRepository.findById(id).orElse(null);
            if (p == null) continue;

            if (p.getCustomerId() == null && doc.get("customer") instanceof Document) {
                Document customerRef = (Document) doc.get("customer");
                Object cid = customerRef.get("$id");
                if (cid instanceof Number) {
                    Long cidLong = ((Number) cid).longValue();
                    p.setCustomerId(cidLong);
                    customerRepository.findById(cidLong).ifPresent(c -> {
                        p.setCustomerName(c.getFullName());
                        p.setCustomerMobile(c.getMobileNumber());
                    });
                    updated = true;
                }
            }

            if (p.getSubscriptionId() == null && doc.get("subscription") instanceof Document) {
                Document subRef = (Document) doc.get("subscription");
                Object sid = subRef.get("$id");
                if (sid instanceof Number) {
                    Long sidLong = ((Number) sid).longValue();
                    p.setSubscriptionId(sidLong);
                    subscriptionRepository.findById(sidLong).ifPresent(sub -> {
                        p.setPlanName(sub.getPlanName());
                    });
                    updated = true;
                }
            }

            if (updated) {
                paymentRepository.save(p);
                log.info("Migrated Payment ID {}", id);
            }
        }
    }
}
