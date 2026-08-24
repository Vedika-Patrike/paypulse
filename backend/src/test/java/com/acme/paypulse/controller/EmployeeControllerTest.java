package com.acme.paypulse.controller;

import com.acme.paypulse.dto.AnalyticsSummaryDto;
import com.acme.paypulse.dto.EmployeeDto;
import com.acme.paypulse.service.EmployeeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    @Test
    @DisplayName("GET /api/v1/employees should return 200 OK with paginated list")
    void getEmployees_Success() throws Exception {
        EmployeeDto dto = new EmployeeDto(1L, "EMP-00001", "Jane", "Doe", "jane.doe@acme.org",
                "Engineering", "Engineer", "United States", BigDecimal.valueOf(100000),
                BigDecimal.valueOf(100000), "USD", "Female", LocalDate.of(2022, 1, 1), 4.2);

        when(employeeService.searchEmployees(any(), any(), any(), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of(dto)));

        mockMvc.perform(get("/api/v1/employees")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].employeeCode").value("EMP-00001"))
                .andExpect(jsonPath("$.content[0].firstName").value("Jane"));
    }

    @Test
    @DisplayName("GET /api/v1/analytics/summary should return 200 OK with HR telemetry metrics")
    void getAnalyticsSummary_Success() throws Exception {
        AnalyticsSummaryDto summary = new AnalyticsSummaryDto(
                10000, BigDecimal.valueOf(1000000000), BigDecimal.valueOf(100000),
                BigDecimal.valueOf(95000), BigDecimal.valueOf(45000), BigDecimal.valueOf(250000),
                "Engineering", 0.96, Map.of("Engineering", 2500L), Map.of("United States", 3000L),
                Map.of("Engineering", BigDecimal.valueOf(300000000)), Map.of("United States", BigDecimal.valueOf(400000000))
        );

        when(employeeService.getAnalyticsSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/v1/analytics/summary")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEmployees").value(10000))
                .andExpect(jsonPath("$.topDepartmentByBudget").value("Engineering"));
    }
}
