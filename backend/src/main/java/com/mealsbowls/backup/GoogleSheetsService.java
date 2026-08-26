package com.mealsbowls.backup;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.BatchUpdateSpreadsheetRequest;
import com.google.api.services.sheets.v4.model.AddSheetRequest;
import com.google.api.services.sheets.v4.model.SheetProperties;
import com.google.api.services.sheets.v4.model.Request;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;

import com.mealsbowls.customer.Customer;
import com.mealsbowls.customer.CustomerRepository;
import com.mealsbowls.meal.MealAuditLog;
import com.mealsbowls.meal.MealAuditLogRepository;
import com.mealsbowls.payment.Payment;
import com.mealsbowls.payment.PaymentRepository;
import com.mealsbowls.subscription.Subscription;
import com.mealsbowls.subscription.SubscriptionRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GoogleSheetsService {

    private static final Logger log = LoggerFactory.getLogger(GoogleSheetsService.class);

    private final CustomerRepository customerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final MealAuditLogRepository mealAuditLogRepository;
    private final PaymentRepository paymentRepository;
    private final BackupLogRepository backupLogRepository;
    private final BackupConfigRepository backupConfigRepository;

    @Value("${app.backup.google-sheet-id:}")
    private String defaultSheetId;

    @Value("${app.backup.credentials-path:credentials.json}")
    private String defaultCredentialsPath;

    public BackupConfig getOrCreateConfig() {
        return backupConfigRepository.findById("DEFAULT")
                .orElseGet(() -> {
                    BackupConfig config = BackupConfig.builder()
                            .id("DEFAULT")
                            .googleSheetId(defaultSheetId)
                            .autoBackupEnabled(true)
                            .cronSchedule("0 0 0 * * ?")
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return backupConfigRepository.save(config);
                });
    }

    public BackupConfig updateConfig(String sheetId, Boolean autoBackupEnabled) {
        BackupConfig config = getOrCreateConfig();
        if (sheetId != null) {
            config.setGoogleSheetId(sheetId.trim());
        }
        if (autoBackupEnabled != null) {
            config.setAutoBackupEnabled(autoBackupEnabled);
        }
        config.setUpdatedAt(LocalDateTime.now());
        return backupConfigRepository.save(config);
    }

    public BackupLog performBackup(String triggerType) {
        LocalDateTime now = LocalDateTime.now();
        BackupConfig config = getOrCreateConfig();
        String targetSheetId = (config.getGoogleSheetId() != null && !config.getGoogleSheetId().isBlank())
                ? config.getGoogleSheetId()
                : defaultSheetId;

        BackupLog logEntry = BackupLog.builder()
                .timestamp(now)
                .triggerType(triggerType)
                .status("IN_PROGRESS")
                .sheetId(targetSheetId)
                .sheetUrl(targetSheetId != null && !targetSheetId.isBlank()
                        ? "https://docs.google.com/spreadsheets/d/" + targetSheetId
                        : null)
                .createdAt(now)
                .build();

        logEntry = backupLogRepository.save(logEntry);

        try {
            if (targetSheetId == null || targetSheetId.isBlank()) {
                throw new IllegalStateException("Google Sheet ID is not configured. Please set the Sheet ID in Backup Settings.");
            }

            Sheets sheetsService = getSheetsService();
            if (sheetsService == null) {
                throw new IllegalStateException("Google Credentials file (credentials.json) missing or invalid.");
            }

            int totalRecords = syncAllDataToSheets(sheetsService, targetSheetId);

            logEntry.setStatus("SUCCESS");
            logEntry.setTotalRecords(totalRecords);
            logEntry.setErrorMessage(null);

            config.setLastBackupTime(now);
            config.setLastBackupStatus("SUCCESS");
            backupConfigRepository.save(config);

            log.info("Backup successfully completed to Google Sheet: {}. Total records: {}", targetSheetId, totalRecords);

        } catch (Exception e) {
            log.error("Google Sheets backup failed: {}", e.getMessage(), e);
            logEntry.setStatus("FAILED");
            logEntry.setErrorMessage(e.getMessage());

            config.setLastBackupStatus("FAILED: " + e.getMessage());
            backupConfigRepository.save(config);
        }

        return backupLogRepository.save(logEntry);
    }

    private Sheets getSheetsService() {
        try {
            InputStream in = null;
            File credFile = new File(defaultCredentialsPath);
            if (credFile.exists()) {
                in = new FileInputStream(credFile);
            } else {
                in = getClass().getClassLoader().getResourceAsStream("credentials.json");
            }

            if (in == null) {
                log.warn("Credentials file not found at: {}", defaultCredentialsPath);
                return null;
            }

            GoogleCredentials credentials = GoogleCredentials.fromStream(in)
                    .createScoped(Collections.singleton(SheetsScopes.SPREADSHEETS));

            return new Sheets.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    new HttpCredentialsAdapter(credentials)
            ).setApplicationName("MealsBowls-Backup").build();

        } catch (Exception e) {
            log.error("Failed to initialize Google Sheets service: {}", e.getMessage());
            return null;
        }
    }

    private int syncAllDataToSheets(Sheets service, String spreadsheetId) throws Exception {
        int totalCount = 0;
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 1. Customers Tab Data
        List<Customer> customers = customerRepository.findAll();
        List<List<Object>> customerRows = new ArrayList<>();
        customerRows.add(Arrays.asList("Customer ID", "Full Name", "Mobile Number", "Status", "Created At"));
        for (Customer c : customers) {
            customerRows.add(Arrays.asList(
                    c.getId() != null ? c.getId() : "",
                    c.getFullName() != null ? c.getFullName() : "",
                    c.getMobileNumber() != null ? c.getMobileNumber() : "",
                    c.getStatus() != null ? c.getStatus().name() : "",
                    c.getCreatedAt() != null ? c.getCreatedAt().format(dtf) : ""
            ));
        }
        totalCount += customers.size();

        // 2. Subscriptions Tab Data
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        List<List<Object>> subRows = new ArrayList<>();
        subRows.add(Arrays.asList("Sub ID", "Customer ID", "Plan Name", "Price (₹)", "Start Date", "Expiry Date", "Total Meals", "Consumed", "Remaining", "Status"));
        for (Subscription s : subscriptions) {
            subRows.add(Arrays.asList(
                    s.getId() != null ? s.getId() : "",
                    s.getCustomerId() != null ? s.getCustomerId() : "",
                    s.getPlanName() != null ? s.getPlanName() : "",
                    s.getPlanPrice() != null ? s.getPlanPrice() : 0.0,
                    s.getStartDate() != null ? s.getStartDate().toString() : "",
                    s.getExpiryDate() != null ? s.getExpiryDate().toString() : "",
                    s.getMealsTotal(),
                    s.getMealsConsumed(),
                    s.getMealsRemaining(),
                    s.getStatus() != null ? s.getStatus().name() : ""
            ));
        }
        totalCount += subscriptions.size();

        // 3. Payments Tab Data
        List<Payment> payments = paymentRepository.findAll();
        List<List<Object>> payRows = new ArrayList<>();
        payRows.add(Arrays.asList("Payment ID", "Customer ID", "Customer Name", "Plan Name", "Amount (₹)", "Payment Date", "Status"));
        for (Payment p : payments) {
            payRows.add(Arrays.asList(
                    p.getId() != null ? p.getId() : "",
                    p.getCustomerId() != null ? p.getCustomerId() : "",
                    p.getCustomerName() != null ? p.getCustomerName() : "",
                    p.getPlanName() != null ? p.getPlanName() : "",
                    p.getAmount() != null ? p.getAmount() : 0.0,
                    p.getPaymentDate() != null ? p.getPaymentDate().toString() : "",
                    p.getStatus() != null ? p.getStatus().name() : ""
            ));
        }
        totalCount += payments.size();

        // 4. Daily Meals Log Tab Data
        List<MealAuditLog> mealLogs = mealAuditLogRepository.findAll();
        List<List<Object>> mealRows = new ArrayList<>();
        mealRows.add(Arrays.asList("Log ID", "Customer ID", "Meal Date", "Meal Type", "Action Status", "Timestamp"));
        for (MealAuditLog m : mealLogs) {
            mealRows.add(Arrays.asList(
                    m.getId() != null ? m.getId() : "",
                    m.getCustomerId() != null ? m.getCustomerId() : "",
                    m.getMealDate() != null ? m.getMealDate().toString() : "",
                    m.getMealType() != null ? m.getMealType().name() : "",
                    m.getAction() != null ? m.getAction().name() : "",
                    m.getCreatedAt() != null ? m.getCreatedAt().format(dtf) : ""
            ));
        }
        totalCount += mealLogs.size();

        // Write data to Sheets
        writeSheetValues(service, spreadsheetId, "Customers!A1", customerRows);
        writeSheetValues(service, spreadsheetId, "Subscriptions!A1", subRows);
        writeSheetValues(service, spreadsheetId, "Payments!A1", payRows);
        writeSheetValues(service, spreadsheetId, "Meal Logs!A1", mealRows);

        return totalCount;
    }

    private void writeSheetValues(Sheets service, String spreadsheetId, String range, List<List<Object>> values) {
        try {
            ValueRange body = new ValueRange().setValues(values);
            service.spreadsheets().values()
                    .update(spreadsheetId, range, body)
                    .setValueInputOption("USER_ENTERED")
                    .execute();
        } catch (Exception e) {
            log.warn("Failed to write to sheet range {}: {}", range, e.getMessage());
            // If tab doesn't exist, try creating tab or falling back to Sheet1
            try {
                String sheetName = range.split("!")[0];
                createSheetTabIfMissing(service, spreadsheetId, sheetName);
                ValueRange body = new ValueRange().setValues(values);
                service.spreadsheets().values()
                        .update(spreadsheetId, range, body)
                        .setValueInputOption("USER_ENTERED")
                        .execute();
            } catch (Exception ex) {
                log.error("Could not write to tab {}: {}", range, ex.getMessage());
            }
        }
    }

    private void createSheetTabIfMissing(Sheets service, String spreadsheetId, String title) {
        try {
            AddSheetRequest addSheetRequest = new AddSheetRequest()
                    .setProperties(new SheetProperties().setTitle(title));
            Request request = new Request().setAddSheet(addSheetRequest);
            BatchUpdateSpreadsheetRequest batchUpdate = new BatchUpdateSpreadsheetRequest()
                    .setRequests(Collections.singletonList(request));
            service.spreadsheets().batchUpdate(spreadsheetId, batchUpdate).execute();
        } catch (Exception e) {
            log.debug("Sheet tab {} might already exist or create tab failed: {}", title, e.getMessage());
        }
    }
}
