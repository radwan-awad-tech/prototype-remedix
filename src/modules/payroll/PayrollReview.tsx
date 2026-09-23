import React, { useState, useEffect } from 'react';
import { CheckCircle2, FileText, Download, Filter, AlertTriangle, Search } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import { payrollService } from '../../services/payrollService';
import { PayrollItem, DataTableColumn } from '../../types';
import { useAuth } from '../auth/AuthContext';

import { useTranslation } from '../../hooks/useTranslation';

export const PayrollReview: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<PayrollItem[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExceptions, setFilterExceptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const runsRes = await payrollService.listRuns();
        if (runsRes.success && runsRes.data.length > 1) {
          const run = runsRes.data[1]; // Using the same logic as RunPayroll
          if (run) {
            setCurrentRunId(run.id);
            const reviewsRes = await payrollService.listReviews(run.id, dept);
            if (reviewsRes.success) {
              setReviews(reviewsRes.data);
            }
          }
        }
      } catch (error) {
        console.error(t('failed_fetch_reviews'), error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filteredData = reviews.filter(row => {
    const matchesSearch = (row.employeeName && row.employeeName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
                         (row.department && row.department.toLowerCase().includes((searchTerm || '').toLowerCase()));
    const matchesException = !filterExceptions || (row.flags && row.flags.length > 0);
    return matchesSearch && matchesException;
  });

  const handleExportSheet = () => {
    if (reviews.length === 0) return;
    
    const headers = [
      t('employee'),
      t('base_salary'),
      t('allowances'),
      t('deductions'),
      t('overtime'),
      t('late_unpaid'),
      t('net_salary'),
      t('flags')
    ].join(',');

    const rows = reviews.map(r => [
      `"${r.employeeName}"`,
      r.baseSalary,
      r.allowances,
      r.deductions,
      r.overtime,
      r.late + r.unpaidLeave,
      r.netSalary,
      `"${r.flags.join(', ')}"`
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_review_${currentRunId || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: DataTableColumn<PayrollItem>[] = [
    { header: 'Employee', translationKey: 'employee', accessor: (row) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{row.employeeName}</p>
        <p className="text-xs text-gray-500">{row.department}</p>
      </div>
    )},
    { header: 'Base Salary', translationKey: 'base_salary', accessor: (row) => <span dir="ltr">${row.baseSalary.toLocaleString()}</span> },
    { header: 'Allowances', translationKey: 'allowances', accessor: (row) => (
      <span className="text-green-600 font-medium" dir="ltr">+${row.allowances.toLocaleString()}</span>
    )},
    { header: 'Deductions', translationKey: 'deductions', accessor: (row) => (
      <span className="text-red-600 font-medium" dir="ltr">-${row.deductions.toLocaleString()}</span>
    )},
    { header: 'Overtime', translationKey: 'overtime', accessor: (row) => <span dir="ltr">${row.overtime.toLocaleString()}</span> },
    { header: 'Late/Unpaid', translationKey: 'late_unpaid', accessor: (row) => (
      <span className="text-red-500" dir="ltr">-${(row.late + row.unpaidLeave).toLocaleString()}</span>
    )},
    { header: 'Net Salary', translationKey: 'net_salary', accessor: (row) => (
      <span className="text-brand-primary-end font-bold text-sm" dir="ltr">${row.netSalary.toLocaleString()}</span>
    )},
    { header: 'Flags', translationKey: 'flags', accessor: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.flags.map((flag, i) => (
          <span key={i} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold uppercase">
            {flag === 'Missing Salary' ? t('missing_salary') : 
             flag === 'Missing Attendance' ? t('missing_attendance') : 
             flag === 'Negative Net' ? t('negative_net') : 
             flag === 'Extreme Values' ? t('extreme_values') : 
             flag === 'Late Penalty Applied' ? t('late_penalty_applied') :
             flag === 'Unpaid Leave Detected' ? t('unpaid_leave_detected') : flag}
          </span>
        ))}
        {row.flags.length === 0 && <span className="text-gray-300 text-xs">—</span>}
      </div>
    )},
  ];

  const handleApprove = async () => {
    if (!currentRunId) return;
    setIsApproving(true);
    try {
      const response = await payrollService.approveRun(currentRunId);
      if (response.success) {
        showToast(t('approve_success'), 'success');
      } else {
        showToast(response.message || t('approve_failed'), 'error');
      }
    } catch (error) {
      showToast(t('approve_failed'), 'error');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('payroll_review')}</h2>
          <p className="text-sm text-gray-500">{t('payroll_review_subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleApprove}
            disabled={isApproving || !currentRunId}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isApproving ? t('approving') : t('approve_run')}
          </button>
          <button 
            onClick={handleExportSheet}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('export_sheet')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t('total_employees'), value: reviews.length.toString(), icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('exceptions_found'), value: reviews.filter(r => r.flags.length > 0).length.toString(), icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: t('net_payroll'), value: `$${reviews.reduce((sum, r) => sum + r.netSalary, 0).toLocaleString()}`, icon: FileText, color: 'text-brand-primary-end', bg: 'bg-brand-primary-start/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 ${stat.bg} rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900" dir="ltr">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('search_employee_dept')}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterExceptions(!filterExceptions)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterExceptions ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {filterExceptions ? t('showing_exceptions') : t('view_exceptions')}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              {t('filters')}
            </button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
        />
      </div>

      {filterExceptions && (
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl">
          <h3 className="text-sm font-bold text-orange-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {t('exception_summary')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t('missing_salary'), count: 2 },
              { label: t('missing_attendance'), count: 3 },
              { label: t('negative_net'), count: 0 },
              { label: t('extreme_values'), count: 3 },
            ].map((ex, i) => (
              <div key={i} className="bg-white p-3 rounded-lg border border-orange-100 flex justify-between items-center">
                <span className="text-sm text-gray-700">{ex.label}</span>
                <span className={`text-sm font-bold ${ex.count > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{ex.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
