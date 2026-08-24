# ⚡ ACME PayPulse — Global Compensation & Salary Intelligence Engine

> **ACME PayPulse** is an enterprise-grade, zero-setup HR analytics and salary intelligence platform. Built with **Java 21**, **Spring Boot 3.3**, an embedded **H2 database**, and a modern **React 18** frontend, it delivers real-time salary telemetry, gender pay parity insights, statistical percentile spectrums, and interactive scenario simulation across **10,000 global employee records**.

---

## 🌟 Key Features

- **⚡ High-Speed Batch Database Seeding (10,000 Records)**:
  Populates 10,000 realistic, multi-country employee records into an in-memory H2 database in **< 3 seconds** (`DataSeeder.java`).
- **📊 Gender Pay Gap & Equity Telemetry**:
  Computes raw company-wide salary variance, median pay gaps, and department-by-department gender equity metrics.
- **📈 Statistical Salary Percentile Spectrum**:
  Calculates dynamic P10, P25, P50 (Median), P75, and P90 salary percentiles with instant department and region filtering.
- **🧮 Interactive "What-If" Compensation Simulator**:
  Enables HR Compensation Directors to simulate percentage merit raises, flat bonuses, and performance rating thresholds with real-time budget impact calculations.
- **📁 Enterprise Employee Directory**:
  Paginated grid with multi-field search, department/country filters, and full Add, Edit, and Delete CRUD operations.
- **📦 Single Executable Runnable JAR**:
  Bundles the compiled React Single Page Application directly inside Spring Boot's static resources for zero-setup execution.

---

## 🛠️ Tech Stack & Prerequisites

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Java 21 + Spring Boot 3.3.4 |
| **Persistence & Database** | Spring Data JPA + Embedded H2 Database (`jdbc:h2:mem:paypulsedb`) |
| **Frontend UI** | React 18 + TypeScript + Vite |
| **Styling & Icons** | Tailwind CSS + Lucide Icons |
| **Data Visualizations** | Recharts Data Visualization Engine |
| **Build Tools** | Maven (Backend) + pnpm/Vite (Frontend) |

> **Prerequisites for running on another user's machine:**
> - **Java 21** (or Java 17+)
> - **Git**

---

## 🚀 Quick Start Guide (How to Clone & Run)

### 1. Clone the Repository
Open a terminal and clone the repository onto your machine:
```bash
git clone https://github.com/Vedika-Patrike/paypulse.git
cd paypulse
```

---

### 2. Run the Application (Zero Setup Required)

You can run the backend and embedded frontend using **Maven** or the **Single Executable JAR**:

#### Option A: Run via Maven (Recommended for Quick Execution)
```bash
cd backend
mvn spring-boot:run
```
- **Automatically seeds 10,000 employee records** into the in-memory H2 database on startup (< 3 seconds).
- Open **`http://localhost:8085`** in your browser to access the complete application!
- H2 Web Console: **`http://localhost:8085/h2-console`** (JDBC URL: `jdbc:h2:mem:paypulsedb`, User: `sa`, Password: *empty*).

---

#### Option B: Build and Run Standalone JAR
```bash
# From the root directory:
cd backend
mvn package -DskipTests
java -jar target/paypulse-app.jar
```
- Open **`http://localhost:8085`** in your browser.

---

### 3. Local Development Setup (Optional for Developers)

If you wish to modify the React frontend with hot-reloading:

```bash
# Terminal 1: Run Spring Boot Backend (Port 8085)
cd backend
mvn spring-boot:run

# Terminal 2: Run React Frontend Dev Server (Port 5173)
cd frontend
pnpm install
pnpm run dev
```
- Open **`http://localhost:5173`** for Vite hot-reloading dev server.

---

## 📂 Repository Structure

```
paypulse/
├── backend/                  # Java 21 Spring Boot REST API
│   ├── src/main/java/        # Entities, Repositories, Services, Controllers
│   ├── src/main/resources/   # application.yml & static SPA bundle
│   ├── src/test/java/        # JUnit 5 unit & integration test suite
│   └── pom.xml               # Maven build configuration
├── frontend/                 # React 18 TypeScript SPA
│   ├── src/components/       # Header, Dashboard, Directory, Analytics, Simulator
│   ├── src/services/         # Axios API client
│   └── vite.config.ts        # Vite configuration & dev proxy
├── docs/                     # Product & Architecture Documentation
│   ├── REQUIREMENTS.md       # Product requirements & persona scope
│   ├── ARCHITECTURE.md       # Data schema & system architecture design
│   ├── AI_PROMPTS.md         # AI prompt trajectory & decision log
│   └── PERFORMANCE.md        # Seeding & query performance benchmarks
└── README.md                 # Project Overview & Quick Start Guide
```

---

## 🧪 Testing & Verification

Run the automated JUnit 5 test suite:

```bash
cd backend
mvn test
```

**Results**: `7 / 7 PASSED (100% Pass Rate)`

---

## 📄 Documentation

- 📄 **[REQUIREMENTS.md](docs/REQUIREMENTS.md)**: Product requirements & persona scope.
- 🏗️ **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: System design & database schema.
- 🧠 **[AI_PROMPTS.md](docs/AI_PROMPTS.md)**: Engineering prompt history.
- ⚡ **[PERFORMANCE.md](docs/PERFORMANCE.md)**: Benchmarks & 10k batch seeding performance.

---

## 📜 License

Built with ❤️ for **ACME PayPulse** Global HR Intelligence.
