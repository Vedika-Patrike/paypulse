package com.acme.paypulse.service;

import com.acme.paypulse.config.DataSeeder;
import com.acme.paypulse.dto.*;
import com.acme.paypulse.entity.Employee;
import com.acme.paypulse.repository.EmployeeRepository;
import com.acme.paypulse.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DataSeeder dataSeeder;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee sampleEmployee;

    @BeforeEach
    void setUp() {
        sampleEmployee = new Employee(
                1L, "EMP-00001", "Jane", "Doe", "jane.doe@acme.org",
                "Engineering", "Software Engineer", "United States",
                BigDecimal.valueOf(120000), BigDecimal.valueOf(120000), "USD",
                "Female", LocalDate.of(2021, 5, 10), 4.5
        );
    }

    @Test
    @DisplayName("Should search employees with pagination")
    void searchEmployees_Success() {
        Page<Employee> page = new PageImpl<>(List.of(sampleEmployee));
        when(employeeRepository.searchEmployees(any(), any(), any(), any(), any(), any()))
                .thenReturn(page);

        Page<EmployeeDto> result = employeeService.searchEmployees("Jane", "Engineering", "United States", "Female", 4.0, PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("EMP-00001", result.getContent().get(0).employeeCode());
    }

    @Test
    @DisplayName("Should calculate correct salary percentiles (P10, P25, P50 Median, P75, P90)")
    void getSalaryPercentiles_Success() {
        List<BigDecimal> sortedSalaries = List.of(
                BigDecimal.valueOf(50000),
                BigDecimal.valueOf(60000),
                BigDecimal.valueOf(70000),
                BigDecimal.valueOf(80000),
                BigDecimal.valueOf(100000)
        );

        when(employeeRepository.findSortedSalaries(null, null)).thenReturn(sortedSalaries);

        PercentilesDto percentiles = employeeService.getSalaryPercentiles("All", "All");

        assertNotNull(percentiles);
        assertEquals(5, percentiles.sampleSize());
        assertEquals(BigDecimal.valueOf(70000.00).setScale(2), percentiles.p50Median());
        assertTrue(percentiles.p10().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(percentiles.p90().compareTo(percentiles.p10()) > 0);
    }

    @Test
    @DisplayName("Should compute gender pay gap analytics accurately")
    void getPayGapAnalytics_Success() {
        Employee male = new Employee(2L, "EMP-00002", "John", "Smith", "john@acme.org",
                "Engineering", "Senior Engineer", "United States",
                BigDecimal.valueOf(140000), BigDecimal.valueOf(140000), "USD",
                "Male", LocalDate.of(2020, 1, 1), 4.0);

        when(employeeRepository.findAll()).thenReturn(List.of(sampleEmployee, male));

        PayGapAnalyticsDto payGap = employeeService.getPayGapAnalytics();

        assertNotNull(payGap);
        assertEquals(BigDecimal.valueOf(140000.00).setScale(2), payGap.overallMaleAvgUSD());
        assertEquals(BigDecimal.valueOf(120000.00).setScale(2), payGap.overallFemaleAvgUSD());
        assertTrue(payGap.rawGenderPayGapPercentage() > 0);
    }

    @Test
    @DisplayName("Should simulate budget impact of percentage salary increase")
    void simulateCompensationAdjustment_Success() {
        when(employeeRepository.findAll()).thenReturn(List.of(sampleEmployee));

        SimulationRequestDto request = new SimulationRequestDto("Engineering", "United States", 4.0, 10.0, BigDecimal.ZERO);

        SimulationResultDto result = employeeService.simulateCompensationAdjustment(request);

        assertNotNull(result);
        assertEquals(1, result.affectedEmployeesCount());
        assertEquals(BigDecimal.valueOf(120000.00).setScale(2), result.originalTotalPayrollUSD());
        assertEquals(BigDecimal.valueOf(132000.00).setScale(2), result.simulatedTotalPayrollUSD());
        assertEquals(BigDecimal.valueOf(12000.00).setScale(2), result.payrollDeltaUSD());
        assertEquals(10.0, result.percentagePayrollIncrease());
    }

    @Test
    @DisplayName("Should throw exception when creating employee with duplicate code")
    void createEmployee_DuplicateCode() {
        EmployeeDto dto = new EmployeeDto(null, "EMP-00001", "Jane", "Doe", "jane@acme.org",
                "Engineering", "Engineer", "US", BigDecimal.valueOf(100000), BigDecimal.valueOf(100000),
                "USD", "Female", LocalDate.now(), 4.0);

        when(employeeRepository.existsByEmployeeCode("EMP-00001")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> employeeService.createEmployee(dto));
    }
}
