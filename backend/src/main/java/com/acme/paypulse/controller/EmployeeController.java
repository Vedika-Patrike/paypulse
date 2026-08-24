package com.acme.paypulse.controller;

import com.acme.paypulse.dto.*;
import com.acme.paypulse.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/employees")
    public ResponseEntity<Page<EmployeeDto>> getEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<EmployeeDto> employees = employeeService.searchEmployees(search, department, country, gender, minRating, pageRequest);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping("/employees")
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto dto) {
        EmployeeDto created = employeeService.createEmployee(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDto dto) {
        EmployeeDto updated = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<AnalyticsSummaryDto> getAnalyticsSummary() {
        return ResponseEntity.ok(employeeService.getAnalyticsSummary());
    }

    @GetMapping("/analytics/pay-gap")
    public ResponseEntity<PayGapAnalyticsDto> getPayGapAnalytics() {
        return ResponseEntity.ok(employeeService.getPayGapAnalytics());
    }

    @GetMapping("/analytics/percentiles")
    public ResponseEntity<PercentilesDto> getSalaryPercentiles(
            @RequestParam(defaultValue = "All") String department,
            @RequestParam(defaultValue = "All") String country) {
        return ResponseEntity.ok(employeeService.getSalaryPercentiles(department, country));
    }

    @PostMapping("/simulation")
    public ResponseEntity<SimulationResultDto> simulateCompensationAdjustment(@RequestBody SimulationRequestDto request) {
        return ResponseEntity.ok(employeeService.simulateCompensationAdjustment(request));
    }

    @GetMapping("/meta/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(employeeService.getDepartments());
    }

    @GetMapping("/meta/countries")
    public ResponseEntity<List<String>> getCountries() {
        return ResponseEntity.ok(employeeService.getCountries());
    }

    @PostMapping("/admin/reseed")
    public ResponseEntity<Map<String, String>> reseedData(@RequestParam(defaultValue = "10000") int count) {
        employeeService.reseedData(count);
        return ResponseEntity.ok(Map.of("message", "Successfully reseeded database with " + count + " employees."));
    }
}
