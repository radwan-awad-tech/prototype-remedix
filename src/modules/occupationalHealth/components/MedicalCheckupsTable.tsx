import React, { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { MedicalCheckup, OHRole } from '../types';
import { PrivacyValue } from './PrivacyValue';
import { Search, Plus } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface MedicalCheckupsTableProps {
  role: OHRole;
  data: MedicalCheckup[];
  onSchedule: () => void;
}

export const MedicalCheckupsTable: React.FC<MedicalCheckupsTableProps> = ({ role, data, onSchedule }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCheckups = data.filter(chk => 
    (chk.employeeName && chk.employeeName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (chk.type && chk.type.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (chk.employeeId && chk.employeeId.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  const columns = [
    {
      header: t('employee'),
      accessor: (item: MedicalCheckup) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{item.employeeName}</span>
          <span className="text-xs text-text-secondary font-mono">{item.employeeId}</span>
        </div>
      ),
    },
    {
      header: t('type'),
      accessor: (item: MedicalCheckup) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.type}</span>
          <span className="text-xs text-text-secondary">{item.date}</span>
        </div>
      ),
    },
    {
      header: t('physician'),
      accessor: (item: MedicalCheckup) => (
        <span className="text-sm text-text-primary">{item.physician}</span>
      ),
    },
    {
      header: t('status'),
      accessor: (item: MedicalCheckup) => {
        const colors: Record<string, string> = {
          'Completed': 'emerald',
          'Scheduled': 'blue',
          'Pending Results': 'amber',
          'Follow-up Required': 'rose'
        };
        const labelKey = `status_${item.status.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '')}` as any;
        return <StatusBadge label={t(labelKey)} type={colors[item.status] as any} />;
      },
    },
    {
      header: t('confidential_findings'),
      accessor: (item: MedicalCheckup) => (
        <PrivacyValue 
          value={item.confidentialFindings || '-'} 
          role={role} 
          requiredRole="OHO" 
          resourceName={`Medical Checkup ${item.id} Confidential Findings`}
        />
      ),
    },
    {
      header: t('next_checkup_date'),
      accessor: (item: MedicalCheckup) => (
        <span className="text-sm text-text-primary">{item.nextCheckupDate || '-'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <input
            type="text"
            placeholder={t('search_checkups')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-border-main bg-white focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main outline-none text-sm transition-all"
          />
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>
        
        {role === 'OHO' && (
          <button 
            onClick={onSchedule}
            className="px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('schedule_checkup')}
          </button>
        )}
      </div>

      <DataTable
        data={filteredCheckups}
        columns={columns}
      />
    </div>
  );
};
