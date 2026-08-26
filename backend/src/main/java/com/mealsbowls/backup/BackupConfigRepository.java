package com.mealsbowls.backup;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BackupConfigRepository extends MongoRepository<BackupConfig, String> {
}
