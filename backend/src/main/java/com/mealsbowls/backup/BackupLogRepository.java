package com.mealsbowls.backup;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BackupLogRepository extends MongoRepository<BackupLog, String> {

    List<BackupLog> findTop20ByOrderByTimestampDesc();

    Page<BackupLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
