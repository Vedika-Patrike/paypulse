package com.acme.paypulse.service.impl;

import com.acme.paypulse.config.DataSeeder;
import com.acme.paypulse.dto.*;
import com.acme.paypulse.entity.Employee;
import com.acme.paypulse.repository.EmployeeRepository;
import com.acme.paypulse.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DataSeeder dataSeeder;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, DataSeeder dataSeeder) {
        this.employeeRepository = employeeRepository;
        this.dataSeeder = dataSeeder;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeDto> searchEmployees(String search, String department, String country, String gender, Double minRating, Pageable pageable) {
        String searchParam = (search == null || search.trim().isEmpty()) ? null : search.trim();
        String deptParam = (department == null || department.trim().isEmpty() || "All".equalsIgnoreCase(department)) ? null : department.trim();
        String countryParam = (country == null || country.trim().isEmpty() || "All".equalsIgnoreCase(country)) ? null : country.trim();
        String genderParam = (gender == null || gender.trim().isEmpty() || "All".equalsIgnoreCase(gender)) ? null : gender.trim();

        return employeeRepository.searchEmployees(searchParam, deptParam, countryParam, genderParam, minRating, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));
        return mapToDto(employee);
    }

    private record CurrencyFx(String currency, double rate) {}

    private CurrencyFx getCurrencyAndFxForCountry(String country) {
        if (country == null) return new CurrencyFx("USD", 1.0);
        return switch (country.trim()) {
            case "United Kingdom" -> new CurrencyFx("GBP", 0.78);
            case "Germany", "France" -> new CurrencyFx("EUR", 0.92);
            case "India" -> new CurrencyFx("INR", 83.50);
            case "Japan" -> new CurrencyFx("JPY", 155.00);
            case "Canada" -> new CurrencyFx("CAD", 1.36);
            case "Australia" -> new CurrencyFx("AUD", 1.50);
            default -> new CurrencyFx("USD", 1.0);
        };
    }

    @Override
    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        if (employeeRepository.existsByEmployeeCode(dto.employeeCode())) {
            throw new IllegalArgumentException("Employee code already exists: " + dto.employeeCode());
        }
        if (employeeRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email already exists: " + dto.email());
        }

        Employee employee = new Employee();
        employee.setEmployeeCode(dto.employeeCode());
        employee.setFirstName(dto.firstName());
        employee.setLastName(dto.lastName());
        employee.setEmail(dto.email());
        employee.setDepartment(dto.department());
        employee.setJobTitle(dto.jobTitle());
        employee.setCountry(dto.country());
        
        BigDecimal salaryUSD = dto.salaryUSD() != null ? dto.salaryUSD() : BigDecimal.valueOf(100000);
        employee.setSalaryUSD(salaryUSD);

        CurrencyFx fx = getCurrencyAndFxForCountry(dto.country());
        employee.setCurrency(dto.currency() != null ? dto.currency() : fx.currency());
        
        BigDecimal localSalary = dto.localSalary() != null ? dto.localSalary() : salaryUSD.multiply(BigDecimal.valueOf(fx.rate())).setScale(2, RoundingMode.HALF_UP);
        employee.setLocalSalary(localSalary);

        employee.setGender(dto.gender() != null ? dto.gender() : "Female");
        employee.setHireDate(dto.hireDate() != null ? dto.hireDate() : LocalDate.now());
        employee.setPerformanceRating(dto.performanceRating() != null ? dto.performanceRating() : 4.0);

        Employee saved = employeeRepository.save(employee);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));

        if (!employee.getEmail().equalsIgnoreCase(dto.email()) && employeeRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email already in use by another employee: " + dto.email());
        }

        employee.setFirstName(dto.firstName());
        employee.setLastName(dto.lastName());
        employee.setEmail(dto.email());
        employee.setDepartment(dto.department());
        employee.setJobTitle(dto.jobTitle());
        employee.setCountry(dto.country());
        
        BigDecimal salaryUSD = dto.salaryUSD() != null ? dto.salaryUSD() : employee.getSalaryUSD();
        employee.setSalaryUSD(salaryUSD);

        CurrencyFx fx = getCurrencyAndFxForCountry(dto.country());
        employee.setCurrency(dto.currency() != null ? dto.currency() : fx.currency());
        
        BigDecimal localSalary = dto.localSalary() != null ? dto.localSalary() : salaryUSD.multiply(BigDecimal.valueOf(fx.rate())).setScale(2, RoundingMode.HALF_UP);
        employee.setLocalSalary(localSalary);

        employee.setGender(dto.gender() != null ? dto.gender() : employee.getGender());
        employee.setHireDate(dto.hireDate() != null ? dto.hireDate() : (employee.getHireDate() != null ? employee.getHireDate() : LocalDate.now()));
        employee.setPerformanceRating(dto.performanceRating() != null ? dto.performanceRating() : employee.getPerformanceRating());

        Employee updated = employeeRepository.save(employee);
        return mapToDto(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new IllegalArgumentException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryDto getAnalyticsSummary() {
        long totalEmployees = employeeRepository.count();
        if (totalEmployees == 0) {
            return new AnalyticsSummaryDto(0, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, "N/A", 1.0, Map.of(), Map.of(), Map.of(), Map.of());
        }

        List<BigDecimal> sortedSalaries = employeeRepository.findSortedSalaries(null, null);
        BigDecimal totalPayrollUSD = sortedSalaries.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal averageSalaryUSD = totalPayrollUSD.divide(BigDecimal.valueOf(totalEmployees), 2, RoundingMode.HALF_UP);
        BigDecimal minSalaryUSD = sortedSalaries.isEmpty() ? BigDecimal.ZERO : sortedSalaries.get(0);
        BigDecimal maxSalaryUSD = sortedSalaries.isEmpty() ? BigDecimal.ZERO : sortedSalaries.get(sortedSalaries.size() - 1);
        BigDecimal medianSalaryUSD = calculatePercentileFromSorted(sortedSalaries, 50);

        Map<String, Long> employeesByDepartment = new LinkedHashMap<>();
        Map<String, BigDecimal> payrollByDepartment = new LinkedHashMap<>();
        for (Object[] row : employeeRepository.findDepartmentAggregations()) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            BigDecimal payroll = (BigDecimal) row[2];
            employeesByDepartment.put(dept, count);
            payrollByDepartment.put(dept, payroll);
        }

        String topDepartment = payrollByDepartment.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        Map<String, Long> employeesByCountry = new LinkedHashMap<>();
        Map<String, BigDecimal> payrollByCountry = new LinkedHashMap<>();
        for (Object[] row : employeeRepository.findCountryAggregations()) {
            String ctry = (String) row[0];
            Long count = (Long) row[1];
            BigDecimal payroll = (BigDecimal) row[2];
            employeesByCountry.put(ctry, count);
            payrollByCountry.put(ctry, payroll);
        }

        PayGapAnalyticsDto payGap = getPayGapAnalytics();
        double genderParityRatio = (payGap.overallMaleAvgUSD().doubleValue() == 0) ? 1.0 :
                payGap.overallFemaleAvgUSD().divide(payGap.overallMaleAvgUSD(), 4, RoundingMode.HALF_UP).doubleValue();

        return new AnalyticsSummaryDto(
                totalEmployees,
                totalPayrollUSD,
                averageSalaryUSD,
                medianSalaryUSD,
                minSalaryUSD,
                maxSalaryUSD,
                topDepartment,
                genderParityRatio,
                employeesByDepartment,
                employeesByCountry,
                payrollByDepartment,
                payrollByCountry
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PayGapAnalyticsDto getPayGapAnalytics() {
        List<Employee> allEmployees = employeeRepository.findAll();

        List<BigDecimal> maleSalaries = allEmployees.stream()
                .filter(e -> "Male".equalsIgnoreCase(e.getGender()))
                .map(Employee::getSalaryUSD)
                .sorted()
                .collect(Collectors.toList());

        List<BigDecimal> femaleSalaries = allEmployees.stream()
                .filter(e -> "Female".equalsIgnoreCase(e.getGender()))
                .map(Employee::getSalaryUSD)
                .sorted()
                .collect(Collectors.toList());

        BigDecimal maleAvg = calcAvg(maleSalaries);
        BigDecimal femaleAvg = calcAvg(femaleSalaries);
        BigDecimal maleMedian = calculatePercentileFromSorted(maleSalaries, 50);
        BigDecimal femaleMedian = calculatePercentileFromSorted(femaleSalaries, 50);

        double rawAvgGap = (maleAvg.doubleValue() == 0) ? 0.0 :
                ((maleAvg.doubleValue() - femaleAvg.doubleValue()) / maleAvg.doubleValue()) * 100.0;

        double rawMedianGap = (maleMedian.doubleValue() == 0) ? 0.0 :
                ((maleMedian.doubleValue() - femaleMedian.doubleValue()) / maleMedian.doubleValue()) * 100.0;

        Map<String, List<Employee>> deptMap = allEmployees.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment));

        List<PayGapAnalyticsDto.DepartmentPayGap> deptBreakdown = new ArrayList<>();
        for (Map.Entry<String, List<Employee>> entry : deptMap.entrySet()) {
            String dept = entry.getKey();
            List<Employee> deptEmps = entry.getValue();

            List<BigDecimal> deptMaleSalaries = deptEmps.stream()
                    .filter(e -> "Male".equalsIgnoreCase(e.getGender()))
                    .map(Employee::getSalaryUSD)
                    .sorted()
                    .collect(Collectors.toList());

            List<BigDecimal> deptFemaleSalaries = deptEmps.stream()
                    .filter(e -> "Female".equalsIgnoreCase(e.getGender()))
                    .map(Employee::getSalaryUSD)
                    .sorted()
                    .collect(Collectors.toList());

            BigDecimal dMaleAvg = calcAvg(deptMaleSalaries);
            BigDecimal dFemaleAvg = calcAvg(deptFemaleSalaries);
            BigDecimal dMaleMedian = calculatePercentileFromSorted(deptMaleSalaries, 50);
            BigDecimal dFemaleMedian = calculatePercentileFromSorted(deptFemaleSalaries, 50);

            double dGap = (dMaleAvg.doubleValue() == 0) ? 0.0 :
                    ((dMaleAvg.doubleValue() - dFemaleAvg.doubleValue()) / dMaleAvg.doubleValue()) * 100.0;

            deptBreakdown.add(new PayGapAnalyticsDto.DepartmentPayGap(
                    dept,
                    deptMaleSalaries.size(),
                    deptFemaleSalaries.size(),
                    dMaleAvg,
                    dFemaleAvg,
                    dMaleMedian,
                    dFemaleMedian,
                    roundTwoDecimals(dGap)
            ));
        }

        deptBreakdown.sort(Comparator.comparing(PayGapAnalyticsDto.DepartmentPayGap::department));

        return new PayGapAnalyticsDto(
                maleAvg, femaleAvg, maleMedian, femaleMedian,
                roundTwoDecimals(rawAvgGap), roundTwoDecimals(rawMedianGap), deptBreakdown
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PercentilesDto getSalaryPercentiles(String department, String country) {
        String deptParam = ("All".equalsIgnoreCase(department)) ? null : department;
        String countryParam = ("All".equalsIgnoreCase(country)) ? null : country;

        List<BigDecimal> sorted = employeeRepository.findSortedSalaries(deptParam, countryParam);

        BigDecimal p10 = calculatePercentileFromSorted(sorted, 10);
        BigDecimal p25 = calculatePercentileFromSorted(sorted, 25);
        BigDecimal p50 = calculatePercentileFromSorted(sorted, 50);
        BigDecimal p75 = calculatePercentileFromSorted(sorted, 75);
        BigDecimal p90 = calculatePercentileFromSorted(sorted, 90);

        return new PercentilesDto(
                deptParam == null ? "All Departments" : deptParam,
                countryParam == null ? "All Countries" : countryParam,
                sorted.size(),
                p10, p25, p50, p75, p90
        );
    }

    @Override
    @Transactional(readOnly = true)
    public SimulationResultDto simulateCompensationAdjustment(SimulationRequestDto request) {
        List<Employee> allEmps = employeeRepository.findAll();

        Map<String, BigDecimal> originalDeptPayroll = allEmps.stream()
                .collect(Collectors.groupingBy(
                        Employee::getDepartment,
                        Collectors.reducing(BigDecimal.ZERO, Employee::getSalaryUSD, BigDecimal::add)
                ));

        BigDecimal originalTotalPayroll = allEmps.stream()
                .map(Employee::getSalaryUSD)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long affectedCount = 0;
        BigDecimal simulatedTotalPayroll = BigDecimal.ZERO;
        Map<String, BigDecimal> simulatedDeptPayroll = new LinkedHashMap<>(originalDeptPayroll);

        for (Employee emp : allEmps) {
            boolean matchesDept = (request.targetDepartment() == null || request.targetDepartment().isEmpty() || "All".equalsIgnoreCase(request.targetDepartment()) || emp.getDepartment().equalsIgnoreCase(request.targetDepartment()));
            boolean matchesCountry = (request.targetCountry() == null || request.targetCountry().isEmpty() || "All".equalsIgnoreCase(request.targetCountry()) || emp.getCountry().equalsIgnoreCase(request.targetCountry()));
            boolean matchesRating = (request.minPerformanceRating() == null || emp.getPerformanceRating() >= request.minPerformanceRating());

            BigDecimal newSalary = emp.getSalaryUSD();
            if (matchesDept && matchesCountry && matchesRating) {
                affectedCount++;
                if (request.percentageIncrease() > 0) {
                    BigDecimal factor = BigDecimal.ONE.add(BigDecimal.valueOf(request.percentageIncrease() / 100.0));
                    newSalary = newSalary.multiply(factor);
                }
                if (request.flatIncreaseUSD() != null && request.flatIncreaseUSD().compareTo(BigDecimal.ZERO) > 0) {
                    newSalary = newSalary.add(request.flatIncreaseUSD());
                }
            }

            final BigDecimal finalSalary = newSalary;
            simulatedTotalPayroll = simulatedTotalPayroll.add(finalSalary);
            simulatedDeptPayroll.compute(emp.getDepartment(), (k, v) -> v == null ? finalSalary : v.add(finalSalary.subtract(emp.getSalaryUSD())));
        }

        BigDecimal deltaUSD = simulatedTotalPayroll.subtract(originalTotalPayroll);
        double pctIncrease = (originalTotalPayroll.doubleValue() == 0) ? 0.0 :
                (deltaUSD.doubleValue() / originalTotalPayroll.doubleValue()) * 100.0;
        BigDecimal avgIncrease = (affectedCount == 0) ? BigDecimal.ZERO :
                deltaUSD.divide(BigDecimal.valueOf(affectedCount), 2, RoundingMode.HALF_UP);

        return new SimulationResultDto(
                affectedCount,
                originalTotalPayroll.setScale(2, RoundingMode.HALF_UP),
                simulatedTotalPayroll.setScale(2, RoundingMode.HALF_UP),
                deltaUSD.setScale(2, RoundingMode.HALF_UP),
                roundTwoDecimals(pctIncrease),
                avgIncrease,
                originalDeptPayroll,
                simulatedDeptPayroll
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getDepartments() {
        return employeeRepository.findDistinctDepartments();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getCountries() {
        return employeeRepository.findDistinctCountries();
    }

    @Override
    public void reseedData(int count) {
        dataSeeder.seedDatabase(count);
    }

    private BigDecimal calculatePercentileFromSorted(List<BigDecimal> sorted, double percentile) {
        if (sorted == null || sorted.isEmpty()) return BigDecimal.ZERO;
        if (sorted.size() == 1) return sorted.get(0).setScale(2, RoundingMode.HALF_UP);

        double index = (percentile / 100.0) * (sorted.size() - 1);
        int lower = (int) Math.floor(index);
        int upper = (int) Math.ceil(index);

        if (lower == upper) {
            return sorted.get(lower).setScale(2, RoundingMode.HALF_UP);
        }

        double fraction = index - lower;
        double lowerVal = sorted.get(lower).doubleValue();
        double upperVal = sorted.get(upper).doubleValue();
        double interpolated = lowerVal + fraction * (upperVal - lowerVal);

        return BigDecimal.valueOf(interpolated).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calcAvg(List<BigDecimal> list) {
        if (list == null || list.isEmpty()) return BigDecimal.ZERO;
        BigDecimal sum = list.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(BigDecimal.valueOf(list.size()), 2, RoundingMode.HALF_UP);
    }

    private double roundTwoDecimals(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private EmployeeDto mapToDto(Employee e) {
        return new EmployeeDto(
                e.getId(), e.getEmployeeCode(), e.getFirstName(), e.getLastName(),
                e.getEmail(), e.getDepartment(), e.getJobTitle(), e.getCountry(),
                e.getSalaryUSD(), e.getLocalSalary(), e.getCurrency(), e.getGender(),
                e.getHireDate(), e.getPerformanceRating()
        );
    }
}
