# Product Requirements Document (PRD) — ACME PayPulse

**Project Name:** ACME PayPulse  
**Target User Persona:** HR Manager & Compensation Director at ACME Org  
**Scale:** 10,000 Employees across 8 Global Operating Regions  

---

## 🎯 1. Executive Summary & Goal

ACME Org manages compensation data for **10,000 employees across 8 global regions** (US, UK, Germany, India, Japan, Canada, Australia, France). Operating across fragmented spreadsheets makes answering executive queries regarding organizational pay equity, compensation distribution, and budget adjustments slow and error-prone.

**Goal:** Deliver a high-performance, web-based compensation intelligence platform (**ACME PayPulse**) enabling HR leaders to manage 10,000 employee records with rock-solid CRUD performance, analyze multi-currency salary distributions (P10, P50/Median, P90), evaluate pay equity, and model compensation budget adjustments in real time with zero setup overhead.

---

## 👤 2. Primary User Persona & Role-Based Visibility

* **Primary Persona:** HR Manager (Sarah Vance)
  * **Core Goals:** Fast employee lookup, rock-solid CRUD workflows, and instant statistical salary distribution breakdowns across departments and countries.
  * **Pain Points:** Searching across 10,000 records in Excel is sluggish; computing median (P50) and P90 percentiles across multi-currency locations requires tedious manual pivot tables.

* **Lightweight Header Persona Switcher:**
  * Rather than adding a complex, time-consuming login/auth system, the UI features a lightweight header toggle (`HR Manager`, `Comp Director`, `Dept Lead`).
  * **Purpose:** Demonstrates role-based visibility thinking with zero setup overhead for reviewers.

---

## ✨ 3. Feature Scope & Architecture Prioritization

### Core Features (High Priority — Primary MVP)
1. **Rock-Solid 10,000 Employee Directory & CRUD**:
   * Database-indexed pagination (50 records/page) over 10,000 employee records with sub-50ms search by Name, Employee Code, or Email.
   * Multi-criteria filtering by Department, Country, Gender, and Performance Rating.
   * Full CRUD (Add, Edit, Delete, View Detail) with real-time UI validation and H2 database persistence.
2. **Salary Distribution & Percentiles (P10, P50/Median, P90)**:
   * Direct answer to *"how the org pays people"* by computing Median (P50), P10, P25, P75, and P90 percentile spectrums alongside department and role averages.
3. **Multi-Currency Normalization**:
   * Native storage of local currencies (`local_salary`, `currency`) alongside normalized common reporting currency (`salaryusd`) using a seeded FX rate conversion table (USD base, GBP 0.78, EUR 0.92, INR 83.5, JPY 155.0, CAD 1.36, AUD 1.50).
4. **Primary Executive Dashboard & Telemetry**:
   * High-level KPI cards: Total Global Payroll (USD), Average Salary, Median Salary (P50), Top Department by Budget, Gender Parity Ratio.

### Stretch Features (Secondary — Built on Rock-Solid Core)
1. **Pay Equity Analytics**: Gender pay variance breakdown across departments (male vs. female average & median salaries).
2. **"What-If" Compensation Scenario Simulator**: Interactive merit raise & flat bonus planner with real-time net budget impact previews.

---

## 📊 4. Data Model Assumptions & Intentional Trade-Offs

| Decision / Trade-Off | Rationale & Architectural Assumption |
| :--- | :--- |
| **Dual Currency Storage (`local_salary` + `salaryusd`)** | Stores native currency and pre-calculates USD reporting amount at write/seed time. Enables sub-millisecond aggregate telemetry without runtime conversion overhead. |
| **Embedded H2 In-Memory Database** | Ensures **zero-setup execution** for reviewers. Spring Boot automatically seeds 10,000 records on startup without requiring local PostgreSQL/MySQL setup. |
| **High-Performance Batch Seeding (`JdbcTemplate`)** | Uses JDBC batch execution (`DataSeeder.java`) to insert 10,000 employee records in **< 3.0 seconds** on startup. |
| **Header Persona Switcher vs. OAuth2 SSO** | Implemented a header toggle (`HR Manager`, `Comp Director`, `Dept Lead`) to showcase role-based visibility thinking without forcing reviewers through login screens or OAuth setup. |
| **Modular Monolith Layout** | Keeps backend Spring Boot API and React SPA single-jar deployable for zero-friction evaluation. |

---

## ⚙️ 5. Non-Functional Performance SLAs

1. **Initial Batch Seed Time**: 10,000 records seeded into H2 DB in **< 3.0 seconds** on startup.
2. **Search & Pagination Latency**: Filtered query response time **< 50 ms**.
3. **Statistical Analytics Query Time**: P10–P90 percentile computation **< 100 ms** across 10k records.
4. **Automated Test Quality**: 100% pass rate on JUnit 5 integration and service unit test suite (`mvn test`).
