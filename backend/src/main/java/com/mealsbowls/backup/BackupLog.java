package com.mealsbowls.backup;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "backup_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackupLog {

    @Id
    private String id;

    private LocalDateTime timestamp;

    private String triggerType; // AUTOMATIC or MANUAL

    private String status; // SUCCESS, FAILED, IN_PROGRESS

    private int totalRecords;

    private String sheetId;

    private String sheetUrl;

    private String errorMessage;

    @CreatedDate
    private LocalDateTime createdAt;
}
