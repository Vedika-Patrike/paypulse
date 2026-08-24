package com.acme.paypulse.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_emp_code", columnList = "employeeCode", unique = true),
    @Index(name = "idx_emp_dept_country", columnList = "department, country"),
    @Index(name = "idx_emp_gender_dept", columnList = "gender, department"),
    @Index(name = "idx_emp_salary", columnList = "salaryUSD")
})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String employeeCode;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(nullable = false, length = 80)
    private String jobTitle;

    @Column(nullable = false, length = 50)
    private String country;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal salaryUSD;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal localSalary;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(nullable = false)
    private LocalDate hireDate;

    @Column(nullable = false)
    private Double performanceRating;

    public Employee() {}

    public Employee(Long id, String employeeCode, String firstName, String lastName, String email,
                    String department, String jobTitle, String country, BigDecimal salaryUSD,
                    BigDecimal localSalary, String currency, String gender, LocalDate hireDate,
                    Double performanceRating) {
        this.id = id;
        this.employeeCode = employeeCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.jobTitle = jobTitle;
        this.country = country;
        this.salaryUSD = salaryUSD;
        this.localSalary = localSalary;
        this.currency = currency;
        this.gender = gender;
        this.hireDate = hireDate;
        this.performanceRating = performanceRating;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public BigDecimal getSalaryUSD() { return salaryUSD; }
    public void setSalaryUSD(BigDecimal salaryUSD) { this.salaryUSD = salaryUSD; }

    public BigDecimal getLocalSalary() { return localSalary; }
    public void setLocalSalary(BigDecimal localSalary) { this.localSalary = localSalary; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }

    public Double getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(Double performanceRating) { this.performanceRating = performanceRating; }
}
