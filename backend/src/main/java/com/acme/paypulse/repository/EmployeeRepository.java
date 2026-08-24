package com.acme.paypulse.repository;

import com.acme.paypulse.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    boolean existsByEmployeeCode(String employeeCode);
    boolean existsByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:search IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:department IS NULL OR e.department = :department) " +
           "AND (:country IS NULL OR e.country = :country) " +
           "AND (:gender IS NULL OR e.gender = :gender) " +
           "AND (:minRating IS NULL OR e.performanceRating >= :minRating)")
    Page<Employee> searchEmployees(
            @Param("search") String search,
            @Param("department") String department,
            @Param("country") String country,
            @Param("gender") String gender,
            @Param("minRating") Double minRating,
            Pageable pageable);

    @Query("SELECT e.department, COUNT(e), SUM(e.salaryUSD), AVG(e.salaryUSD) FROM Employee e GROUP BY e.department")
    List<Object[]> findDepartmentAggregations();

    @Query("SELECT e.country, COUNT(e), SUM(e.salaryUSD), AVG(e.salaryUSD) FROM Employee e GROUP BY e.country")
    List<Object[]> findCountryAggregations();

    @Query("SELECT e.salaryUSD FROM Employee e WHERE " +
           "(:department IS NULL OR e.department = :department) AND " +
           "(:country IS NULL OR e.country = :country) " +
           "ORDER BY e.salaryUSD ASC")
    List<BigDecimal> findSortedSalaries(@Param("department") String department, @Param("country") String country);

    @Query("SELECT DISTINCT e.department FROM Employee e ORDER BY e.department ASC")
    List<String> findDistinctDepartments();

    @Query("SELECT DISTINCT e.country FROM Employee e ORDER BY e.country ASC")
    List<String> findDistinctCountries();
}
