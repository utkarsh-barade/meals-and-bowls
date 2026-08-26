package com.mealsbowls.backup;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "backup_config")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackupConfig {

    @Id
    private String id; // Single record key e.g. "DEFAULT"

    private String googleSheetId;

    @Builder.Default
    private boolean autoBackupEnabled = true;

    @Builder.Default
    private boolean notificationsEnabled = true;

    @Builder.Default
    private String cronSchedule = "0 0 0 * * ?";

    private LocalDateTime lastBackupTime;

    private String lastBackupStatus;

    private LocalDateTime updatedAt;
}
