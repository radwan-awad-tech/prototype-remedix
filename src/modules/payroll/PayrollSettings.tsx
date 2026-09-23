import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Power, Settings, ShieldCheck } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Tabs } from '../../components/ui/Tabs';
import { Drawer } from '../../components/ui/Drawer';
import { useToast } from '../../components/ui/Toast';
import { payrollService } from '../../services/payrollService';
import { PayrollComponent, PayrollRule, DataTableColumn } from '../../types';

import { useTranslation } from '../../hooks/useTranslation';

export const PayrollSettings: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [components, setComponents] = useState<PayrollComponent[]>([]);
  const [rules, setRules] = useState<PayrollRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('components');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [componentsData, rulesData] = await Promise.all([
          payrollService.listComponents(),
          payrollService.listRules()
        ]);
        setComponents(componentsData);
        setRules(rulesData);
      } catch (error) {
        console.error('Failed to fetch payroll settings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const componentColumns: DataTableColumn<PayrollComponent>[] = [
    { header: 'Name', translationKey: 'name', accessor: (row) => row.name },
    { header: 'Type', translationKey: 'type', accessor: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.type === 'Allowance' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {row.type === 'Allowance' ? t('allowance') : t('deduction')}
      </span>
    )},
    { header: 'Calc Method', translationKey: 'calc_method', accessor: (row) => row.calcMethod === 'Fixed' ? t('fixed') : row.calcMethod === 'Percentage' ? t('percentage') : row.calcMethod === 'Formula' ? t('formula') : t('multiplier') },
    { header: 'Value', translationKey: 'value', accessor: (row) => row.calcMethod === 'Percentage' ? `${row.value}%` : `$${row.value}` },
    { header: 'Status', translationKey: 'status', accessor: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {row.isActive ? t('active') : t('inactive')}
      </span>
    )},
    { header: 'Actions', translationKey: 'actions', accessor: (row) => (
      <div className="flex gap-2">
        <button className="p-1 text-gray-400 hover:text-brand-primary-end">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-red-600">
          <Power className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  const ruleColumns: DataTableColumn<PayrollRule>[] = [
    { header: 'Rule Name', translationKey: 'rule_name', accessor: (row) => row.name },
    { header: 'Value', translationKey: 'value', accessor: (row) => <span dir="ltr">{`${row.value} ${t(row.unit.toLowerCase() as any)}`}</span> },
    { header: 'Description', translationKey: 'description', accessor: (row) => row.description },
    { header: 'Actions', translationKey: 'actions', accessor: (row) => (
      <button className="p-1 text-gray-400 hover:text-brand-primary-end">
        <Edit2 className="w-4 h-4" />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('payroll_settings')}</h2>
          <p className="text-sm text-gray-500">{t('payroll_settings_subtitle')}</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 btn-gradient-primary rounded-lg shadow-sm text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {t('add_component')}
        </button>
      </div>

      <Tabs
        tabs={[
          { id: 'components', label: t('components'), icon: <Settings className="w-4 h-4" /> },
          { id: 'rules', label: t('rules_rates'), icon: <ShieldCheck className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'components' ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <DataTable
            columns={componentColumns}
            data={components}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <DataTable
              columns={ruleColumns}
              data={rules}
              isLoading={isLoading}
            />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">{t('v2_optional_toggles')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: t('night_shift_allowance'), description: t('enable_extra_pay_night') },
                { label: t('weekend_allowance'), description: t('enable_extra_pay_weekend') },
                { label: t('on_call_allowance'), description: t('enable_pay_on_call') },
              ].map((toggle, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{toggle.label}</p>
                    <p className="text-xs text-gray-500">{toggle.description}</p>
                  </div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-not-allowed">
                    <div className="absolute start-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={t('add_payroll_component')}
      >
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          showToast(t('component_added_success'), 'success');
          setIsDrawerOpen(false);
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('component_name')}</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 outline-none" placeholder={t('eg_travel_allowance')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('type')}</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 outline-none">
              <option value="Allowance">{t('allowance')}</option>
              <option value="Deduction">{t('deduction')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('calc_method')}</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 outline-none">
              <option value="Fixed">{t('fixed')}</option>
              <option value="Percentage">{t('percentage')}</option>
              <option value="Formula">{t('formula')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('value')}</label>
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 outline-none" placeholder="0.00" required />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full py-2 btn-gradient-primary rounded-lg font-medium shadow-sm">
              {t('save_component')}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
