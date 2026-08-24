package com.acme.paypulse.dto;

import java.math.BigDecimal;
import java.util.List;

public record PayGapAnalyticsDto(
    BigDecimal overallMaleAvgUSD,
    BigDecimal overallFemaleAvgUSD,
    BigDecimal overallMaleMedianUSD,
    BigDecimal overallFemaleMedianUSD,
    double rawGenderPayGapPercentage,
    double rawMedianPayGapPercentage,
    List<DepartmentPayGap> departmentBreakdown
) {
    public record DepartmentPayGap(
        String department,
        long maleCount,
        long femaleCount,
        BigDecimal maleAvgUSD,
        BigDecimal femaleAvgUSD,
        BigDecimal maleMedianUSD,
        BigDecimal femaleMedianUSD,
        double payGapPercentage
    ) {}
}
