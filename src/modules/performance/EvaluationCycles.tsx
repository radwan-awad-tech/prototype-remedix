import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Play, XCircle, CheckCircle2 } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { performanceService } from '../../services/performanceService';
import { EvaluationCycle, CycleStatus, EvaluationTemplate, Employee, DataTableColumn } from '../../types';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';

export const EvaluationCycles: React.FC = () => {
  const { t } = useTranslation();
  const [cycles, setCycles] = useState<EvaluationCycle[]>([]);
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<EvaluationCycle | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cyclesRes, templatesRes, employeesRes] = await Promise.all([
          performanceService.listCycles(),
          performanceService.listTemplates(),
          employeeService.listEmployees()
        ]);
        
        if (cyclesRes.success) setCycles(cyclesRes.data);
        if (templatesRes.success) setTemplates(templatesRes.data);
        if (employeesRes.success) setEmployees(employeesRes.data);
      } catch (error) {
        console.error('Failed to fetch cycles data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns: DataTableColumn<EvaluationCycle>[] = [
    { 
      header: 'Cycle Name', 
      translationKey: 'performance_cycle_name',
      accessor: (row: EvaluationCycle) => (
        <div className="flex flex-col text-start">
          <span className="font-medium text-gray-900">{row.name}</span>
          <span className="text-xs text-gray-500">{row.templateName}</span>
        </div>
      )
    },
    { 
      header: 'Timeline', 
      translationKey: 'performance_timeline',
      accessor: (row: EvaluationCycle) => (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          {row.startDate} {t('to')} {row.dueDate}
        </div>
      )
    },
    { 
      header: 'Status', 
      translationKey: 'status',
      accessor: (row: EvaluationCycle) => (
        <StatusBadge status={row.status} />
      )
    },
    { 
      header: 'Completion', 
      translationKey: 'performance_completion',
      accessor: (row: EvaluationCycle) => (
        <div className="w-full max-w-[100px]">
          <div className="flex justify-between text-[10px] mb-1">
            <span>{row.completionPercentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                row.completionPercentage === 100 ? 'bg-green-500' : 'bg-brand-primary-end'
              }`}
              style={{ width: `${row.completionPercentage}%` }}
            />
          </div>
        </div>
      )
    },
    { 
      header: 'Actions', 
      translationKey: 'actions',
      accessor: (row: EvaluationCycle) => (
        <div className="flex items-center gap-2">
          {row.status === 'Draft' && (
            <button 
              onClick={() => handleStatusChange(row.id, 'Active')}
              className="p-1 hover:bg-green-50 rounded text-green-600"
              title={t('performance_start_cycle')}
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {row.status === 'Active' && (
            <>
              <button 
                onClick={() => { setSelectedCycle(row); setIsAssignDrawerOpen(true); }}
                className="p-1 hover:bg-brand-primary-start/10 rounded text-brand-primary-end"
                title={t('performance_assign_evaluators')}
              >
                <Users className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleStatusChange(row.id, 'Closed')}
                className="p-1 hover:bg-orange-50 rounded text-orange-600"
                title={t('close')}
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          {row.status === 'Closed' && (
            <button 
              onClick={() => handleStatusChange(row.id, 'Finalized')}
              className="p-1 hover:bg-brand-primary-start/10 rounded text-brand-primary-end"
              title={t('performance_finalize_results')}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    },
  ];

  const handleStatusChange = (id: string, status: CycleStatus) => {
    setCycles(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast(t('performance_cycle_status_updated', { status: status ? status.toLowerCase() : '' }), 'success');
  };

  const handleStartCycle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const templateId = formData.get('templateId') as string;
    const dueDate = formData.get('dueDate') as string;

    if (!name.trim() || !templateId || !dueDate) {
      showToast(t('performance_all_fields_required'), 'error');
      return;
    }

    const template = templates.find(t => t.id === templateId);

    const newCycle: EvaluationCycle = {
      id: `CYC-00${cycles.length + 1}`,
      name,
      templateId,
      templateName: template?.name || 'Unknown Template',
      startDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Draft',
      completionPercentage: 0,
      scope: formData.get('scope') as 'Department' | 'All',
      participants: employees.map(emp => emp.id), // Simplified for v1
    };

    setCycles([newCycle, ...cycles]);
    setIsDrawerOpen(false);
    showToast(t('performance_cycle_created'), 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('performance_cycles_title')}</h2>
          <p className="text-sm text-gray-500">{t('performance_cycles_subtitle')}</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 btn-gradient-primary rounded-lg shadow-sm text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {t('performance_start_cycle')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable data={cycles} columns={columns} isLoading={isLoading} />
      </div>

      {/* Start Cycle Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={t('performance_start_new_cycle')}
        footer={
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              form="cycle-form"
              type="submit"
              className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm"
            >
              {t('performance_start_cycle')}
            </button>
          </div>
        }
      >
        <form id="cycle-form" onSubmit={handleStartCycle} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_cycle_name')}</label>
              <input 
                name="name"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start"
                placeholder={t('performance_cycle_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_template')}</label>
              <select 
                name="templateId"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start"
              >
                {templates.filter(t => t.status === 'Published').map(t => (
                  <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_scope')}</label>
                <select 
                  name="scope"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start"
                >
                  <option value="All">{t('performance_all_employees')}</option>
                  <option value="Department">{t('performance_specific_dept')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_due_date')}</label>
                <input 
                  name="dueDate"
                  type="date" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start"
                />
              </div>
            </div>
            <div className="p-4 bg-brand-primary-start/10 rounded-lg border border-brand-primary-start/20">
              <p className="text-xs text-brand-primary-end leading-relaxed">
                <span className="font-semibold">{t('note')}:</span> {t('performance_cycle_note')}
              </p>
            </div>
          </div>
        </form>
      </Drawer>

      {/* Assign Evaluators Drawer */}
      <Drawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        title={`${t('performance_assign_evaluators')}: ${selectedCycle?.name}`}
        footer={
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setIsAssignDrawerOpen(false)}
              className="w-full px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm"
            >
              {t('performance_save_assignments')}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">{t('performance_assign_evaluators_desc')}</p>
          
          <div className="space-y-3">
            {employees.slice(1, 4).map(emp => (
              <div key={emp.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</span>
                  <span className="text-xs text-gray-500">{emp.position}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 mb-1">{t('performance_evaluator')}</span>
                  <select className="text-xs border-gray-300 rounded p-1">
                    <option>Sarah Mitchell ({t('manager')})</option>
                    <option>John Doe ({t('peer')})</option>
                    <option>{t('other')}...</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
};
