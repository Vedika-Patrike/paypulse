# Product Requirements Document (PRD) — ACME PayPulse

**Project Name:** ACME PayPulse  
**Target User Persona:** HR Manager & Compensation Director at ACME Org  
**Scale:** 10,000 Employees across 8 Global Operating Regions  

---

## 🎯 1. Executive Summary & Goal

ACME Org currently manages salary data for **10,000 employees across 8 global countries** using fragmented Excel spreadsheets. This process is error-prone, slow, and makes answering executive queries regarding organizational pay parity, compensation distribution, and equity compliance extremely tedious.

**Goal:** Deliver a modern, web-based salary management & compensation intelligence platform (**ACME PayPulse**) enabling HR leaders to seamlessly manage 10,000 employee records, gain instant multi-country pay insights, analyze gender pay equity, and simulate salary adjustment budgets in real time with zero setup overhead.

---

## 🔍 2. User Persona & Use Cases

* **Primary Persona:** HR Manager (Sarah Vance)
  * **Pain Points:** 
    * Opening 50+ MB Excel sheets crashes laptop; searching for individual records is sluggish.
    * Calculating median salary or P90 percentile by department across converted local currencies takes hours.
    * Executive board asks: *"What is our gender pay gap in Engineering across US vs. Germany?"* — Excel requires manual pivot tables each time.
    * Simulating a 4.5% cost-of-living raise for specific departments requires duplicating formulas and risk breaking cell references.

---

## ✨ 3. Functional Scope & Key Features

### Feature 1: High-Performance 10,000 Employee Directory
* Instant paginated list (50 records/page) over 10,000 employee records with sub-50ms search by Name, Employee Code, or Email.
* Multi-criteria filtering by Department (Engineering, Sales, Product, HR, Marketing, Finance, Operations, Legal), Country (US, UK, Germany, India, Japan, Canada, Australia, France), Gender, and Performance Rating.
* Full CRUD (Add, Edit, Delete, View Detail) with real-time UI validation.
* One-click CSV export of filtered or full salary datasets.

### Feature 2: Executive HR Dashboard & Telemetry
* Live KPI metrics: Total Global Payroll (USD), Average Salary, Median Salary (P50), Top Department by Budget, Gender Parity Ratio.
* Interactive distribution charts for payroll allocation across departments and countries.

### Feature 3: Deep Compensation Analytics & Pay Parity
* **Percentile Spectrum**: Calculates P10, P25, P50 (Median), P75, and P90 compensation tiers by role & department.
* **Gender Pay Gap Analysis**: Automatically computes raw and department-adjusted pay gaps between genders with visual variance charts.
* **Multi-Currency Normalization**: Toggle between USD normalized amounts and local currencies (USD, EUR, GBP, INR, JPY, CAD, AUD) with real-time exchange conversion.

### Feature 4: Interactive "What-If" Compensation Simulator
* HR Managers can model prospective salary adjustments (e.g. `+4.5%` raise for Engineering or `+$3,000` flat adjustment for high performers).
* Previews immediate delta in total annual payroll budget and visualizes before-vs-after departmental distribution before committing.

---

## 🚫 4. Deliberately Left Out (Scope Boundaries & Trade-Offs)

| Out-of-Scope Feature | Reasoning & Engineering Trade-Off |
| :--- | :--- |
| **Real-Time Bank Transfers & Direct Deposit Integration** | Focus is strictly on *compensation intelligence & HR decision-making*. Payment execution belongs in a separate banking integration gateway. |
| **Multi-Tenant SSO / OAuth2 Identity Provider** | Implemented a light role-switcher (HR Executive, Comp Director, Department Lead) for instantaneous reviewer testing without forcing auth token setup or external OAuth callback configuration. |
| **External Distributed Database (e.g. Postgres Cluster)** | Choice of Spring Boot embedded H2 database (file/memory mode) allows **zero-setup execution**. Evaluators can execute `java -jar paypulse-backend.jar` without Docker or external DB instances. |
| **Complex Microservice Architecture** | A modular monolith with clear domain separation (Controller, Service, Repository, DTO, Entity) avoids unnecessary network latency and deployment complexity while maintaining clean architecture. |

---

## ⚙️ 5. Non-Functional Requirements & Performance SLAs

1. **Initial Seed Time**: 10,000 records seeded into H2 DB in **< 2.0 seconds** on cold startup.
2. **Search API Latency**: Filter & paginated query response time **< 50 ms**.
3. **UI Responsiveness**: Instant UI rendering using React 18 & Virtualized/Paginated tables.
4. **Test Quality**: Automated unit & integration test suite covering core percentile calculations, pay gap algorithms, and REST endpoints.
