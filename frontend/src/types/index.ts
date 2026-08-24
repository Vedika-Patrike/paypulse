export interface Employee {
  id?: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  country: string;
  salaryUSD: number;
  localSalary: number;
  currency: string;
  gender: string;
  hireDate: string;
  performanceRating: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface AnalyticsSummary {
  totalEmployees: number;
  totalPayrollUSD: number;
  averageSalaryUSD: number;
  medianSalaryUSD: number;
  minSalaryUSD: number;
  maxSalaryUSD: number;
  topDepartmentByBudget: string;
  genderParityRatio: number;
  employeesByDepartment: Record<string, number>;
  employeesByCountry: Record<string, number>;
  payrollByDepartment: Record<string, number>;
  payrollByCountry: Record<string, number>;
}

export interface DepartmentPayGap {
  department: string;
  maleCount: number;
  femaleCount: number;
  maleAvgUSD: number;
  femaleAvgUSD: number;
  maleMedianUSD: number;
  femaleMedianUSD: number;
  payGapPercentage: number;
}

export interface PayGapAnalytics {
  overallMaleAvgUSD: number;
  overallFemaleAvgUSD: number;
  overallMaleMedianUSD: number;
  overallFemaleMedianUSD: number;
  rawGenderPayGapPercentage: number;
  rawMedianPayGapPercentage: number;
  departmentBreakdown: DepartmentPayGap[];
}

export interface Percentiles {
  departmentFilter: string;
  countryFilter: string;
  sampleSize: number;
  p10: number;
  p25: number;
  p50Median: number;
  p75: number;
  p90: number;
}

export interface SimulationRequest {
  targetDepartment: string;
  targetCountry: string;
  minPerformanceRating: number | null;
  percentageIncrease: number;
  flatIncreaseUSD: number;
}

export interface SimulationResult {
  affectedEmployeesCount: number;
  originalTotalPayrollUSD: number;
  simulatedTotalPayrollUSD: number;
  payrollDeltaUSD: number;
  percentagePayrollIncrease: number;
  averageIncreasePerEmployeeUSD: number;
  originalDeptPayroll: Record<string, number>;
  simulatedDeptPayroll: Record<string, number>;
}
