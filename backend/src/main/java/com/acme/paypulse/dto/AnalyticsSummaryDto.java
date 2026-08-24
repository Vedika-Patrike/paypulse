package com.acme.paypulse.dto;

import java.math.BigDecimal;
import java.util.Map;

public record AnalyticsSummaryDto(
    long totalEmployees,
    BigDecimal totalPayrollUSD,
    BigDecimal averageSalaryUSD,
    BigDecimal medianSalaryUSD,
    BigDecimal minSalaryUSD,
    BigDecimal maxSalaryUSD,
    String topDepartmentByBudget,
    double genderParityRatio,
    Map<String, Long> employeesByDepartment,
    Map<String, Long> employeesByCountry,
    Map<String, BigDecimal> payrollByDepartment,
    Map<String, BigDecimal> payrollByCountry
) {}
