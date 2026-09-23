import React, { useState, useEffect } from 'react';
import { History, Download, Eye, CheckCircle2, Search, Filter } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import { payrollService } from '../../services/payrollService';
import { PayrollRun, DataTableColumn } from '../../types';

import { useTranslation } from '../../hooks/useTranslation';

export const PayrollHistory: React.FC = () => {
  const { t } = useTranslation();
  const { info } = useToast();
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const response = await payrollService.listRuns();
        if (response.success) {
          setRuns(response.data);
        }
      } catch (error) {
        console.error(t('failed_fetch_history'), error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRuns();
  }, []);

  const filteredData = runs.filter(r => r.period && r.period.toLowerCase().includes((searchTerm || '').toLowerCase()));

  const handleDownloadReport = (run: PayrollRun) => {
    const content = `${t('payroll_report')} - ${run.period}\n${t('status')}: ${run.status}\n${t('total_base')}: $${run.totalBaseSalary}\n${t('total_net')}: $${run.totalNet}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll_report_${run.period}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    info(t('report_download_success'));
  };

  const handleExportHistory = () => {
    if (filteredData.length === 0) return;
    const headers = [t('period'), t('status'), t('total_base'), t('total_net'), t('approved_by'), t('approved_at')].join(',');
    const rows = filteredData.map(r => [
      r.period,
      r.status,
      r.totalBaseSalary,
      r.totalNet,
      r.approvedBy || '',
      r.approvedAt || ''
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: DataTableColumn<PayrollRun>[] = [
    { header: 'Period', translationKey: 'period', accessor: (row) => (
      <span className="font-bold text-gray-900">{row.period}</span>
    )},
    { header: 'Status', translationKey: 'status', accessor: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-brand-primary-start/10 text-brand-primary-end'
      }`}>
        {row.status === 'Approved' ? t('approved') : row.status === 'Locked' ? t('locked') : row.status === 'Calculated' ? t('calculated') : t('draft')}
      </span>
    )},
    { header: 'Total Base', translationKey: 'total_base', accessor: (row) => <span dir="ltr">${row.totalBaseSalary.toLocaleString()}</span> },
    { header: 'Total Net', translationKey: 'total_net', accessor: (row) => (
      <span className="font-bold text-brand-primary-end" dir="ltr">${row.totalNet.toLocaleString()}</span>
    )},
    { header: 'Approved By', translationKey: 'approved_by', accessor: (row) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{row.approvedBy || '—'}</span>
        <span className="text-xs text-gray-500">{row.approvedAt || ''}</span>
      </div>
    )},
    { header: 'Actions', translationKey: 'actions', accessor: (row) => (
      <div className="flex gap-2">
        <button 
          onClick={() => setSelectedRun(row)}
          className="p-1 text-gray-400 hover:text-brand-primary-end"
          title={t('view_details')}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDownloadReport(row)}
          className="p-1 text-gray-400 hover:text-brand-primary-end"
          title={t('download_report')}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {selectedRun && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedRun.period}</h3>
                <p className="text-sm text-gray-500">{t('payroll_summary')}</p>
              </div>
              <button 
                onClick={() => setSelectedRun(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Filter className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('status')}</span>
                <span className="font-bold text-gray-900">{selectedRun.status}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('base_salary')}</span>
                <span className="font-bold text-gray-900" dir="ltr">${selectedRun.totalBaseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('total_allowances')}</span>
                <span className="font-bold text-green-600" dir="ltr">+${selectedRun.totalAllowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('total_deductions')}</span>
                <span className="font-bold text-red-600" dir="ltr">-${selectedRun.totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-brand-primary-start/10 rounded-lg">
                <span className="text-brand-primary-end font-medium">{t('net_payable')}</span>
                <span className="font-bold text-brand-primary-end" dir="ltr">${selectedRun.totalNet.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedRun(null)}
              className="w-full py-3 btn-gradient-primary rounded-xl font-bold text-white shadow-lg"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('payroll_history')}</h2>
          <p className="text-sm text-gray-500">{t('payroll_history_desc')}</p>
        </div>
        <button 
          onClick={handleExportHistory}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          {t('export_history')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t('total_runs'), value: '24', icon: History, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: t('total_paid_ytd'), value: '$12.4M', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: t('avg_monthly_net'), value: '$520K', icon: CheckCircle2, color: 'text-brand-primary-end', bg: 'bg-brand-primary-start/10' },
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
              placeholder={t('search_period_approver')}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            {t('filters')}
          </button>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
