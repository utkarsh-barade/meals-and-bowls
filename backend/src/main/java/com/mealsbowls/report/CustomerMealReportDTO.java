package com.mealsbowls.report;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomerMealReportDTO {
    private Long logId;
    private LocalDate mealDate;
    private String mealType;
    private String action;
    private LocalDateTime servedAt;
}
