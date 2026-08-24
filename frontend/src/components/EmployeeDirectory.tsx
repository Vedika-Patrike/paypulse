import React, { useState, useEffect } from 'react';
import { Employee, PageResponse } from '../types';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/api';
import {
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building,
  Globe,
  Star,
  X,
  AlertCircle,
} from 'lucide-react';

interface EmployeeDirectoryProps {
  departments: string[];
  countries: string[];
  onRefreshSummary: () => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  departments,
  countries,
  onRefreshSummary,
}) => {
  const [data, setData] = useState<PageResponse<Employee> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter & Search Params
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  // Pagination Params
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50);
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortDir, setSortDir] = useState<string>('asc');

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    country: 'United States',
    salaryUSD: 100000,
    localSalary: 100000,
    currency: 'USD',
    gender: 'Female',
    hireDate: new Date().toISOString().split('T')[0],
    performanceRating: 4.0,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({
        search: search.trim() || undefined,
        department: selectedDept === 'All' ? undefined : selectedDept,
        country: selectedCountry === 'All' ? undefined : selectedCountry,
        gender: selectedGender === 'All' ? undefined : selectedGender,
        minRating: minRating,
        page,
        size: pageSize,
        sortBy,
        sortDir,
      });
      setData(res);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, selectedDept, selectedCountry, selectedGender, minRating, page, pageSize, sortBy, sortDir]);

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      employeeCode: `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName: '',
      lastName: '',
      email: '',
      department: departments[0] || 'Engineering',
      jobTitle: 'Software Engineer',
      country: countries[0] || 'United States',
      salaryUSD: 110000,
      localSalary: 110000,
      currency: 'USD',
      gender: 'Female',
      hireDate: new Date().toISOString().split('T')[0],
      performanceRating: 4.0,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setFormError(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeCode) {
      setFormError('Please fill in all required employee attributes.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingEmployee && editingEmployee.id) {
        await updateEmployee(editingEmployee.id, formData);
      } else {
        await createEmployee(formData);
      }
      setShowModal(false);
      fetchEmployees();
      onRefreshSummary();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save employee record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee record?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
        onRefreshSummary();
      } catch (err) {
        console.error('Failed to delete employee', err);
      }
    }
  };

  const handleExportCSV = () => {
    if (!data || !data.content) return;
    const headers = ['Employee Code', 'First Name', 'Last Name', 'Email', 'Department', 'Job Title', 'Country', 'Salary (USD)', 'Gender', 'Rating'];
    const rows = data.content.map((e) => [
      e.employeeCode, e.firstName, e.lastName, e.email, e.department, e.jobTitle, e.country, e.salaryUSD, e.gender, e.performanceRating
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ACME_PayPulse_Employees_Page_${page + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <span>Employee Salary Directory</span>
          </h2>
          <p className="text-xs text-slate-400">
            Paginated search over {data?.totalElements?.toLocaleString() || 10000} records
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Name, Code, Email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={selectedDept}
            onChange={(e) => { setSelectedDept(e.target.value); setPage(0); }}
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <select
            value={selectedCountry}
            onChange={(e) => { setSelectedCountry(e.target.value); setPage(0); }}
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={selectedGender}
            onChange={(e) => { setSelectedGender(e.target.value); setPage(0); }}
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>
        </div>

        {/* Min Rating Filter */}
        <div>
          <select
            value={minRating === undefined ? '' : minRating}
            onChange={(e) => { setMinRating(e.target.value ? parseFloat(e.target.value) : undefined); setPage(0); }}
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Any Performance Rating</option>
            <option value="4.5">★ 4.5+ (Top Performers)</option>
            <option value="4.0">★ 4.0+ (Strong)</option>
            <option value="3.0">★ 3.0+ (Satisfactory)</option>
          </select>
        </div>

      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => setSortBy('employeeCode')}>Code</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => setSortBy('firstName')}>Employee Name</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => setSortBy('department')}>Department</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => setSortBy('jobTitle')}>Job Title</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => setSortBy('country')}>Country</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => setSortBy('salaryUSD')}>Salary (USD)</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    Loading 10,000 employee records...
                  </td>
                </tr>
              ) : !data || data.content.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No employee records match the specified filters.
                  </td>
                </tr>
              ) : (
                data.content.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition duration-150">
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-400">{emp.employeeCode}</td>
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{emp.firstName} {emp.lastName}</div>
                      <div className="text-[10px] text-slate-500">{emp.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{emp.jobTitle}</td>
                    <td className="py-3 px-4 text-slate-300">{emp.country}</td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                      ${emp.salaryUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{emp.gender}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {emp.performanceRating.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(emp)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                        title="Edit Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => emp.id && handleDelete(emp.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {data && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/80 border-t border-slate-800 text-xs">
            
            <div className="text-slate-400">
              Showing page <strong className="text-white">{data.number + 1}</strong> of <strong className="text-white">{data.totalPages}</strong> ({data.totalElements.toLocaleString()} total employees)
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400">Page Size:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(0); }}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  disabled={data.first}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={data.last}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 space-y-5 border border-slate-700/80 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingEmployee ? 'Edit Employee Record' : 'Add New Employee'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Salary (USD)</label>
                  <input
                    type="number"
                    value={formData.salaryUSD}
                    onChange={(e) => setFormData({ ...formData, salaryUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Performance Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.performanceRating}
                    onChange={(e) => setFormData({ ...formData, performanceRating: parseFloat(e.target.value) || 3.0 })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Employee'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
