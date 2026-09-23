import React, { useState, useEffect } from 'react';
import { Download, Search, Filter, FileText, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { payrollService } from '../../services/payrollService';
import { Payslip, DataTableColumn } from '../../types';

import { useTranslation } from '../../hooks/useTranslation';

import { useAuth } from '../../modules/auth/AuthContext';

export const Payslips: React.FC = () => {
  const { t } = useTranslation();
  const { info } = useToast();
  const { user } = useAuth();
  const isEmployee = user?.role === 'Employee';
  
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'HR' | 'Self'>(isEmployee ? 'Self' : 'HR');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  useEffect(() => {
    if (isEmployee && viewMode !== 'Self') {
      setViewMode('Self');
    }
  }, [isEmployee, viewMode]);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const response = await payrollService.listPayslips();
        if (response.success) {
          setPayslips(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch payslips', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayslips();
  }, []);

  const filteredData = payslips.filter(row => {
    if (viewMode === 'Self') {
      const matchesUser = user ? row.employeeId === user.id : true;
      const matchesSearch = row.period && row.period.toLowerCase().includes((searchTerm || '').toLowerCase());
      return matchesUser && matchesSearch;
    }
    
    // HR View filtering
    const matchesSearch = (row.employeeName && row.employeeName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
                         (row.period && row.period.toLowerCase().includes((searchTerm || '').toLowerCase()));
    
    if (user?.role === 'Department Head' && user.department) {
      return row.department === user.department && matchesSearch;
    }
    
    return matchesSearch;
  });
  const handleDownloadPdf = (payslip: Payslip) => {
    // Mock PDF download
    const content = `${t('payslip')} - ${payslip.employeeName} - ${payslip.period}\n${t('base_salary')}: $${payslip.baseSalary}\n${t('net_salary')}: $${payslip.netSalary}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payslip_${payslip.employeeId}_${payslip.period}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    info(t('payslip_download_success'));
  };

  const handleBulkGenerate = () => {
    if (filteredData.length === 0) return;
    
    setIsBulkGenerating(true);
    setBulkProgress(0);
    
    const total = filteredData.length;
    let current = 0;
    
    const interval = setInterval(() => {
      current += Math.ceil(total / 5);
      if (current >= total) {
        current = total;
        clearInterval(interval);
        setTimeout(() => {
          setIsBulkGenerating(false);
          info(t('bulk_generate_success'));
        }, 500);
      }
      setBulkProgress(Math.round((current / total) * 100));
    }, 300);
  };

  const columns: DataTableColumn<Payslip>[] = [
    { header: 'Period', translationKey: 'period', accessor: (row) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-gray-900">{row.period}</span>
      </div>
    )},
    { header: 'Employee Name', translationKey: 'employee_name', accessor: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-brand-primary-start/10 rounded-full flex items-center justify-center text-[10px] font-bold text-brand-primary-end">
          {row.employeeName.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm text-gray-700">{row.employeeName}</span>
      </div>
    )},
    { header: 'Base Salary', translationKey: 'base_salary', accessor: (row) => <span dir="ltr">${row.baseSalary.toLocaleString()}</span> },
    { header: 'Net Payable', translationKey: 'net_payable', accessor: (row) => (
      <span className="font-bold text-brand-primary-end" dir="ltr">${row.netSalary.toLocaleString()}</span>
    )},
    { header: 'Generated At', translationKey: 'generated_at', accessor: (row) => row.generatedAt },
    { header: 'Actions', translationKey: 'actions', accessor: (row) => (
      <button 
        onClick={() => handleDownloadPdf(row)}
        className="flex items-center gap-1 text-brand-primary-end hover:text-brand-primary-end font-medium text-sm"
      >
        <Download className="w-4 h-4" />
        {t('download_pdf')}
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('payslips')}</h2>
          <p className="text-sm text-gray-500">{t('payslips_subtitle')}</p>
        </div>
        {!isEmployee && (
          <div className="flex bg-white border border-gray-300 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('HR')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'HR' ? 'bg-brand-primary-end text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {t('hr_view')}
            </button>
            <button 
              onClick={() => setViewMode('Self')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'Self' ? 'bg-brand-primary-end text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {t('my_payslips')}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={viewMode === 'HR' ? t('search_employee_dept') : t('search_period')}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              {t('filters')}
            </button>
            {viewMode === 'HR' && (
              <button 
                onClick={handleBulkGenerate}
                className="flex items-center gap-2 px-3 py-2 bg-brand-primary-end text-white rounded-lg text-sm font-medium hover:bg-brand-primary-end transition-colors"
              >
                <FileText className="w-4 h-4" />
                {t('bulk_generate')}
              </button>
            )}
          </div>
        </div>
        <DataTable
          columns={columns.filter(c => viewMode === 'HR' || c.header !== t('employee_name'))}
          data={filteredData}
          isLoading={isLoading}
        />
      </div>

      <Modal
        isOpen={isBulkGenerating}
        onClose={() => setIsBulkGenerating(false)}
        title={t('bulk_generate')}
      >
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('bulk_generating_msg', { count: filteredData.length })}
            </span>
            <span className="text-sm font-bold text-brand-primary-end">{bulkProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-brand-primary-end h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${bulkProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            {t('please_wait')}
          </p>
        </div>
      </Modal>

      {viewMode === 'Self' && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">{t('latest_payslip_summary')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">{t('period')}</span>
                <span className="text-sm font-medium text-gray-900">{filteredData[0].period}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">{t('base_salary')}</span>
                <span className="text-sm font-medium text-gray-900" dir="ltr">${filteredData[0].baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">{t('total_allowances')}</span>
                <span className="text-sm font-medium text-green-600" dir="ltr">+${filteredData[0].allowances.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">{t('total_deductions')}</span>
                <span className="text-sm font-medium text-red-600" dir="ltr">-${filteredData[0].deductions.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-gray-900">{t('net_payable')}</span>
                <span className="text-xl font-bold text-brand-primary-end" dir="ltr">${filteredData[0].netSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary-start to-brand-primary-end p-6 rounded-xl text-white">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">{t('medistaff_hr')}</span>
            </div>
            <p className="text-sm opacity-80 mb-1">{t('employee_name')}</p>
            <p className="text-xl font-bold mb-4">{filteredData[0].employeeName}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80 mb-1">{t('employee_id')}</p>
                <p className="text-sm font-mono">{filteredData[0].employeeId}</p>
              </div>
              <button 
                onClick={() => handleDownloadPdf(filteredData[0])}
                className="px-4 py-2 bg-white text-brand-primary-end rounded-lg text-sm font-bold hover:bg-brand-primary-start/10 transition-colors"
              >
                {t('download_pdf')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
