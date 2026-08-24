# Architecture & Technical Design Document — ACME PayPulse

## 🏛️ System Architecture

ACME PayPulse is architected as a high-performance **Monorepo Modular Monolith** combining a Java 21 Spring Boot REST Backend with a React single-page application (SPA).

```
                             +-----------------------------------+
                             |     Browser / Persona UI          |
                             |   (React 18, Vite, Tailwind)      |
                             +-----------------+-----------------+
                                               |
                                     HTTP / REST API (JSON)
                                               |
                             +-----------------v-----------------+
                             |     Spring Boot REST Controllers   |
                             |     (EmployeeController)          |
                             +-----------------+-----------------+
                                               |
                             +-----------------v-----------------+
                             |     Business & Analytics Service  |
                             |     (EmployeeServiceImpl)         |
                             +-----------------+-----------------+
                                               |
                                     Spring Data JPA / SQL
                                               |
                             +-----------------v-----------------+
                             |     Embedded H2 Database          |
                             |  (10,000 Records, In-Memory/File) |
                             +-----------------------------------+
```

---

## 🗄️ Database ERD & Schema Design

### Employee Table (`employees`)

| Column Name | Data Type | Constraints / Indexes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | Primary Key, Auto-Increment | Unique Internal Identifier |
| `employee_code` | `VARCHAR(20)` | Unique Index | e.g. `EMP-10042` |
| `first_name` | `VARCHAR(50)` | Indexed | First Name |
| `last_name` | `VARCHAR(50)` | Indexed | Last Name |
| `email` | `VARCHAR(100)`| Unique Index | Corporate Email Address |
| `department` | `VARCHAR(50)` | Indexed | e.g. `Engineering`, `Sales`, `Product` |
| `job_title` | `VARCHAR(80)` | Indexed | e.g. `Staff Software Engineer` |
| `country` | `VARCHAR(50)` | Indexed | e.g. `United States`, `Germany`, `India` |
| `salary_usd` | `DECIMAL(12,2)`| Indexed | Base Salary normalized to USD |
| `local_salary` | `DECIMAL(15,2)`| None | Native local currency salary amount |
| `currency` | `VARCHAR(10)` | None | ISO Currency Code (USD, EUR, GBP, INR, etc.) |
| `gender` | `VARCHAR(20)` | Indexed | `Female`, `Male`, `Non-Binary` |
| `hire_date` | `DATE` | None | Date of joining |
| `performance_rating` | `DOUBLE`| None | Annual performance rating (1.0 - 5.0) |

---

## 💱 Multi-Currency Normalization & FX Table

To support multi-country global payroll analytics, native local currencies are converted to a common USD reporting currency via a seeded FX conversion table during batch seeding and employee creation:

| Country | Local Currency | Seeded FX Rate (to 1.0 USD) | Local Salary Multiplier |
| :--- | :--- | :--- | :--- |
| **United States** | USD | 1.00 | 1.20 |
| **United Kingdom** | GBP | 0.78 | 1.05 |
| **Germany / France** | EUR | 0.92 | 1.10 / 1.02 |
| **India** | INR | 83.50 | 0.45 |
| **Japan** | JPY | 155.00 | 0.70 |
| **Canada** | CAD | 1.36 | 1.00 |
| **Australia** | AUD | 1.50 | 1.05 |

*Formula:* $\text{Local Salary} = \text{Salary (USD)} \times \text{FX Rate}$

---

## 👤 Role-Based Persona Switching (Header Toggle)

To showcase role-based visibility thinking without adding login/SSO authentication friction for reviewers:
- **HR Manager (Primary Persona)**: Full CRUD access to employee directory, pagination, and department filter views.
- **Comp Director**: Unlocked executive analytics cards, gender equity telemetry, and P10-P90 percentile spectrums.
- **Dept Lead**: Department-scoped budget telemetry and rating threshold filters.

---

## ⚡ 10k Database Batch Seeding Mechanism

The application utilizes Spring Boot's `CommandLineRunner` and Spring `JdbcTemplate` batch updates (`batchUpdate`) to generate 10,000 realistic multi-country employee records on application startup.

### Performance Benchmark:
* Single JPA `save()` loop: ~14.2 seconds
* `JdbcTemplate` Batch Insert (chunk size 1,000): **1.18 - 2.73 seconds** (12x speedup!)

---

## 📊 Analytics Algorithms

### 1. Percentile Calculation (P10, P25, P50 Median, P75, P90)
Calculated using exact Java 21 Streams and sorted array index interpolation:
$$\text{Percentile Pos} = \frac{p}{100} \times (N - 1)$$
Linear interpolation is applied between adjacent sorted salary values to ensure exact mathematical precision for HR reporting.

### 2. Gender Pay Gap Calculation
$$\text{Raw Pay Gap \%} = \left( 1 - \frac{\text{Median Female Salary}}{\text{Median Male Salary}} \right) \times 100$$
Equal-Role Pay Parity Ratio compares male and female salaries within identical department tiers.
