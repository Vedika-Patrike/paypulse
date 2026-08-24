import axios from 'axios';
import {
  Employee,
  PageResponse,
  AnalyticsSummary,
  PayGapAnalytics,
  Percentiles,
  SimulationRequest,
  SimulationResult,
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = async (params: {
  search?: string;
  department?: string;
  country?: string;
  gender?: string;
  minRating?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<PageResponse<Employee>> => {
  const response = await api.get('/employees', { params });
  return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employee: Partial<Employee>): Promise<Employee> => {
  const response = await api.post('/employees', employee);
  return response.data;
};

export const updateEmployee = async (id: number, employee: Partial<Employee>): Promise<Employee> => {
  const response = await api.put(`/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}`);
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const response = await api.get('/analytics/summary');
  return response.data;
};

export const getPayGapAnalytics = async (): Promise<PayGapAnalytics> => {
  const response = await api.get('/analytics/pay-gap');
  return response.data;
};

export const getSalaryPercentiles = async (department = 'All', country = 'All'): Promise<Percentiles> => {
  const response = await api.get('/analytics/percentiles', {
    params: { department, country },
  });
  return response.data;
};

export const simulateCompensation = async (request: SimulationRequest): Promise<SimulationResult> => {
  const response = await api.post('/simulation', request);
  return response.data;
};

export const getDepartments = async (): Promise<string[]> => {
  const response = await api.get('/meta/departments');
  return response.data;
};

export const getCountries = async (): Promise<string[]> => {
  const response = await api.get('/meta/countries');
  return response.data;
};

export const reseedDatabase = async (count = 10000): Promise<{ message: string }> => {
  const response = await api.post('/admin/reseed', null, { params: { count } });
  return response.data;
};
