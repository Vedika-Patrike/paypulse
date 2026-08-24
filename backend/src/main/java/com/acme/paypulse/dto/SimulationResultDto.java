package com.acme.paypulse.dto;

import java.math.BigDecimal;
import java.util.Map;

public record SimulationResultDto(
    long affectedEmployeesCount,
    BigDecimal originalTotalPayrollUSD,
    BigDecimal simulatedTotalPayrollUSD,
    BigDecimal payrollDeltaUSD,
    double percentagePayrollIncrease,
    BigDecimal averageIncreasePerEmployeeUSD,
    Map<String, BigDecimal> originalDeptPayroll,
    Map<String, BigDecimal> simulatedDeptPayroll
) {}
