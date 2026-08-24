package com.acme.paypulse.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeDto(
    Long id,
    String employeeCode,
    String firstName,
    String lastName,
    String email,
    String department,
    String jobTitle,
    String country,
    BigDecimal salaryUSD,
    BigDecimal localSalary,
    String currency,
    String gender,
    LocalDate hireDate,
    Double performanceRating
) {}
