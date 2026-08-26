package com.mealsbowls.backup;

import com.mealsbowls.common.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/backup")
@RequiredArgsConstructor
public class BackupController {

    private final GoogleSheetsService googleSheetsService;
    private final BackupLogRepository backupLogRepository;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBackupStatus() {
        BackupConfig config = googleSheetsService.getOrCreateConfig();
        List<BackupLog> recentLogs = backupLogRepository.findTop20ByOrderByTimestampDesc();
        BackupLog lastLog = recentLogs.isEmpty() ? null : recentLogs.get(0);

        Map<String, Object> data = new HashMap<>();
        data.put("config", config);
        data.put("lastLog", lastLog);
        data.put("recentLogsCount", recentLogs.size());

        return ResponseEntity.ok(ApiResponse.success("Backup status retrieved", data));
    }

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<BackupLog>>> getBackupLogs() {
        List<BackupLog> logs = backupLogRepository.findTop20ByOrderByTimestampDesc();
        return ResponseEntity.ok(ApiResponse.success("Backup logs retrieved", logs));
    }

    @PostMapping("/trigger")
    public ResponseEntity<ApiResponse<BackupLog>> triggerManualBackup() {
        BackupLog log = googleSheetsService.performBackup("MANUAL");
        if ("SUCCESS".equals(log.getStatus())) {
            return ResponseEntity.ok(ApiResponse.success("Manual backup completed successfully!", log));
        } else {
            return ResponseEntity.ok(ApiResponse.error("Backup failed: " + log.getErrorMessage()));
        }
    }

    @PostMapping("/config")
    public ResponseEntity<ApiResponse<BackupConfig>> updateConfig(@RequestBody UpdateConfigRequest request) {
        BackupConfig updated = googleSheetsService.updateConfig(request.getGoogleSheetId(), request.getAutoBackupEnabled());
        return ResponseEntity.ok(ApiResponse.success("Backup configuration updated successfully", updated));
    }

    @Data
    public static class UpdateConfigRequest {
        private String googleSheetId;
        private Boolean autoBackupEnabled;
    }
}
