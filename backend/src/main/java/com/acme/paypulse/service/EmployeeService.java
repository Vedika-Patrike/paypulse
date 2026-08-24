package com.acme.paypulse.service;

import com.acme.paypulse.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeService {

    Page<EmployeeDto> searchEmployees(String search, String department, String country, String gender, Double minRating, Pageable pageable);

    EmployeeDto getEmployeeById(Long id);

    EmployeeDto createEmployee(EmployeeDto employeeDto);

    EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto);

    void deleteEmployee(Long id);

    AnalyticsSummaryDto getAnalyticsSummary();

    PayGapAnalyticsDto getPayGapAnalytics();

    PercentilesDto getSalaryPercentiles(String department, String country);

    SimulationResultDto simulateCompensationAdjustment(SimulationRequestDto request);

    List<String> getDepartments();

    List<String> getCountries();

    void reseedData(int count);
}
