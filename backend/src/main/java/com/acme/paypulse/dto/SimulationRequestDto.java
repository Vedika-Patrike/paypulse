package com.acme.paypulse.dto;

import java.math.BigDecimal;

public record SimulationRequestDto(
    String targetDepartment,
    String targetCountry,
    Double minPerformanceRating,
    double percentageIncrease,
    BigDecimal flatIncreaseUSD
) {}
