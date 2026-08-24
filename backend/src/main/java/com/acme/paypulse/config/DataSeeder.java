package com.acme.paypulse.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final JdbcTemplate jdbcTemplate;

    @Value("${paypulse.seeder.enabled:true}")
    private boolean seederEnabled;

    @Value("${paypulse.seeder.employee-count:10000}")
    private int employeeCount;

    public DataSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!seederEnabled) {
            logger.info("DataSeeder is disabled via application configuration.");
            return;
        }

        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM employees", Integer.class);
        if (count != null && count > 0) {
            logger.info("Database already contains {} employee records. Skipping initial seeding.", count);
            return;
        }

        seedDatabase(employeeCount);
    }

    private record CountryConfig(String name, String currency, double rate, double salaryMultiplier) {}

    @Transactional
    public void seedDatabase(int targetCount) {
        logger.info("Starting high-performance batch seeding for {} employee records...", targetCount);
        long startTime = System.currentTimeMillis();

        jdbcTemplate.execute("TRUNCATE TABLE employees");

        String sql = "INSERT INTO employees (employee_code, first_name, last_name, email, department, job_title, country, salaryusd, local_salary, currency, gender, hire_date, performance_rating) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String[] firstNames = {
            "Alexander", "Charlotte", "Benjamin", "Amelia", "Daniel", "Sophia", "Ethan", "Emma", "Oliver", "Ava",
            "Liam", "Isabella", "Noah", "Mia", "William", "Harper", "James", "Evelyn", "Lucas", "Abigail",
            "Aarav", "Priya", "Rahul", "Ananya", "Kenji", "Yuki", "Lukas", "Hannah", "Mateo", "Camila"
        };

        String[] lastNames = {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
            "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
            "Sharma", "Patel", "Tanaka", "Sato", "Schneider", "Weber", "Silva", "Santos", "Dubois", "Lefebvre"
        };

        String[] departments = {"Engineering", "Product", "Sales", "Marketing", "HR", "Finance", "Operations", "Legal"};

        Map<String, List<String>> jobTitles = Map.of(
            "Engineering", List.of("Software Engineer", "Senior Engineer", "Staff Engineer", "DevOps Engineer", "QA Engineer", "Engineering Manager"),
            "Product", List.of("Product Manager", "Senior PM", "UI/UX Designer", "Design Lead", "Technical Writer"),
            "Sales", List.of("Account Executive", "Sales Manager", "Business Development Rep", "Enterprise AE", "VP of Sales"),
            "Marketing", List.of("Marketing Specialist", "Content Lead", "SEO Specialist", "Growth Manager", "CMO Specialist"),
            "HR", List.of("HR Generalist", "Recruiter", "Compensation Specialist", "HRBP", "Head of People"),
            "Finance", List.of("Financial Analyst", "Accountant", "Finance Manager", "Controller", "Payroll Lead"),
            "Operations", List.of("Operations Associate", "Supply Chain Lead", "Operations Director", "Logistics Analyst"),
            "Legal", List.of("Corporate Counsel", "Legal Specialist", "Compliance Manager", "Paralegal")
        );

        List<CountryConfig> countries = List.of(
            new CountryConfig("United States", "USD", 1.0, 1.20),
            new CountryConfig("United Kingdom", "GBP", 0.78, 1.05),
            new CountryConfig("Germany", "EUR", 0.92, 1.10),
            new CountryConfig("India", "INR", 83.5, 0.45),
            new CountryConfig("Japan", "JPY", 155.0, 0.70),
            new CountryConfig("Canada", "CAD", 1.36, 1.00),
            new CountryConfig("Australia", "AUD", 1.50, 1.05),
            new CountryConfig("France", "EUR", 0.92, 1.02)
        );

        String[] genders = {"Female", "Female", "Male", "Male", "Female", "Male", "Non-Binary"};

        Random random = new Random(42);
        List<Object[]> batchParams = new ArrayList<>(1000);

        for (int i = 1; i <= targetCount; i++) {
            String empCode = String.format("EMP-%05d", i);
            String fn = firstNames[random.nextInt(firstNames.length)];
            String ln = lastNames[random.nextInt(lastNames.length)];
            String email = fn.toLowerCase() + "." + ln.toLowerCase() + i + "@acme.org";
            String dept = departments[random.nextInt(departments.length)];
            List<String> titles = jobTitles.get(dept);
            String title = titles.get(random.nextInt(titles.size()));
            CountryConfig country = countries.get(random.nextInt(countries.size()));
            String gender = genders[random.nextInt(genders.length)];

            double baseSalaryUSD = (45000 + random.nextInt(165000)) * country.salaryMultiplier();
            if (title.contains("Manager") || title.contains("Lead") || title.contains("Staff")) {
                baseSalaryUSD += 35000;
            }
            if (title.contains("Director") || title.contains("VP") || title.contains("Head")) {
                baseSalaryUSD += 70000;
            }

            BigDecimal salaryUSD = BigDecimal.valueOf(baseSalaryUSD).setScale(2, RoundingMode.HALF_UP);
            BigDecimal localSalary = salaryUSD.multiply(BigDecimal.valueOf(country.rate())).setScale(2, RoundingMode.HALF_UP);

            long minDay = LocalDate.of(2014, 1, 1).toEpochDay();
            long maxDay = LocalDate.of(2025, 12, 31).toEpochDay();
            long randomDay = minDay + random.nextLong(maxDay - minDay);
            Date hireDate = Date.valueOf(LocalDate.ofEpochDay(randomDay));

            double rating = 2.5 + (random.nextInt(26) / 10.0);

            batchParams.add(new Object[]{
                empCode, fn, ln, email, dept, title, country.name(),
                salaryUSD, localSalary, country.currency(), gender, hireDate, rating
            });

            if (batchParams.size() == 1000) {
                jdbcTemplate.batchUpdate(sql, batchParams);
                batchParams.clear();
            }
        }

        if (!batchParams.isEmpty()) {
            jdbcTemplate.batchUpdate(sql, batchParams);
        }

        long duration = System.currentTimeMillis() - startTime;
        logger.info("Completed seeding {} employee records in {} ms!", targetCount, duration);
    }
}
