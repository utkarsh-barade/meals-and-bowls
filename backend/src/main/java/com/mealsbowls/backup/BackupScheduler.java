package com.mealsbowls.backup;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BackupScheduler {

    private static final Logger log = LoggerFactory.getLogger(BackupScheduler.class);

    private final GoogleSheetsService googleSheetsService;

    /**
     * Executes automatically every night at 12:00 AM Midnight IST (00:00:00)
     */
    @Scheduled(cron = "${app.backup.cron:0 0 0 * * ?}")
    public void runMidnightBackup() {
        BackupConfig config = googleSheetsService.getOrCreateConfig();
        if (!config.isAutoBackupEnabled()) {
            log.info("Daily 12:00 AM Midnight backup skipped because autoBackupEnabled is false.");
            return;
        }

        log.info("Starting Daily 12:00 AM Midnight Google Sheets Data Backup...");
        googleSheetsService.performBackup("AUTOMATIC");
    }
}
