package com.acme.paypulse.dto;

import java.math.BigDecimal;

public record PercentilesDto(
    String departmentFilter,
    String countryFilter,
    long sampleSize,
    BigDecimal p10,
    BigDecimal p25,
    BigDecimal p50Median,
    BigDecimal p75,
    BigDecimal p90
) {}
