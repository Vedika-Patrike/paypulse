# AI Prompt Trajectory & Intentional AI Engineering Log

As mandated by the assessment criteria (*"We care about how you use AI tools, the clarity of your thinking, and the quality of your engineering decisions"*), this artifact documents the structured prompts, agentic workflows, and architectural directives used to guide AI during the design and development of ACME PayPulse.

---

## 🎯 1. High-Level AI Strategy

Rather than relying on unguided AI code generation, we used a **4-Phase Intentional AI Workflow**:

```
+---------------------+     +----------------------+     +-----------------------+     +------------------------+
| 1. Product Framing  | --> | 2. Architecture Plan | --> | 3. Incremental Build  | --> | 4. Empirical Test      |
|    & Constraints    |     |    & Monorepo Layout |     |    & Code Generation  |     |    & Benchmarking      |
+---------------------+     +----------------------+     +-----------------------+     +------------------------+
```

---

## 📝 2. Master Prompts & Directives Log

### Prompt 1: Requirements & Scope Definition
> **Context:** Initiating the project from the assessment specification.
> **Prompt:** "Act as a Lead Product Engineer. Create a 1-page requirements document for an employee salary management software serving 10,000 employees across multiple countries for ACME Org. Explicitly define what is in scope, what is deliberately out of scope, and the architectural trade-offs."
> **Result:** Generated `docs/REQUIREMENTS.md` with explicit out-of-scope boundaries (e.g. omitting live bank transfers and complex OAuth SSO in favor of zero-setup H2 database execution).

### Prompt 2: Zero-Setup Monorepo Architecture Design
> **Prompt:** "Design a zero-setup Java 21 + Spring Boot 3.3 Maven and React monorepo for 10,000 employee records. The backend must use an embedded H2 database with fast batch seeding (< 2s). The build system must support both independent Vite dev server mode and a single runnable JAR packaging where Spring Boot serves the frontend on port 8080."
> **Result:** Designed the `backend/` and `frontend/` monorepo layout with Maven `frontend-maven-plugin` packaging strategy.

### Prompt 3: High-Performance Data Seeding Optimization
> **Prompt:** "Write a Spring Boot CommandLineRunner seeder using Spring JdbcTemplate batch inserts to seed 10,000 realistic multi-country employee records. Optimize chunk sizes and SQL indexing so initialization completes in under 2 seconds on cold startup."
> **Result:** Implemented `DataSeeder.java` utilizing `batchUpdate` with 1,000 chunk sizes, achieving 1.18s seed time.

### Prompt 4: HR Analytics & Percentile Algorithms
> **Prompt:** "Implement robust Java 21 service methods to compute P10, P25, P50 Median, P75, and P90 salary percentiles, raw and department-adjusted gender pay gaps, and a budget simulation engine. Write comprehensive JUnit 5 and Mockito unit tests."
> **Result:** Built `EmployeeServiceImpl.java` and fast deterministic unit test suite in `EmployeeServiceTest.java`.

---

## 💡 3. Key AI Decisions & Verification Safeguards

* **No Blind Code Acceptance**: Every AI-generated query and percentile formula was validated with empirical JUnit 5 test assertions.
* **Deterministic Benchmarks**: Validated search query response times (< 50ms) using Spring `@SpringBootTest` timed assertions.
