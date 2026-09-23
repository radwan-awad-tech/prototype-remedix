import React, { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Vaccination, OHRole } from '../types';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface VaccinationsTableProps {
  role: OHRole;
  data: Vaccination[];
  onAdd: () => void;
}

export const VaccinationsTable: React.FC<VaccinationsTableProps> = ({ role, data, onAdd }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVaccinations = data.filter(vac => 
    (vac.employeeName && vac.employeeName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (vac.vaccineName && vac.vaccineName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (vac.employeeId && vac.employeeId.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  const columns = [
    {
      header: t('employee'),
      accessor: (item: Vaccination) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{item.employeeName}</span>
          <span className="text-xs text-text-secondary font-mono">{item.employeeId}</span>
        </div>
      ),
    },
    {
      header: t('vaccinations'),
      accessor: (item: Vaccination) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.vaccineName}</span>
          <span className="text-xs text-text-secondary">{t('dose')} {item.doseNumber} {t('of')} {item.totalDoses}</span>
        </div>
      ),
    },
    {
      header: t('date'),
      accessor: (item: Vaccination) => (
        <span className="text-sm text-text-primary">{item.dateAdministered}</span>
      ),
    },
    {
      header: t('next_checkup_date'),
      accessor: (item: Vaccination) => (
        <span className="text-sm text-text-primary">{item.nextDoseDate || '-'}</span>
      ),
    },
    {
      header: t('status'),
      accessor: (item: Vaccination) => {
        const colors: Record<string, string> = {
          'Completed': 'emerald',
          'Partially Completed': 'blue',
          'Due': 'amber',
          'Overdue': 'rose'
        };
        const labelKey = `status_${item.status.toLowerCase().replace(/\s+/g, '_')}` as any;
        return <StatusBadge label={t(labelKey)} type={colors[item.status] as any} />;
      },
    },
    {
      header: t('provider'),
      accessor: (item: Vaccination) => (
        <span className="text-sm text-text-secondary">{item.provider}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <input
            type="text"
            placeholder={t('search_vaccinations')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-border-main bg-white focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main outline-none text-sm transition-all"
          />
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>
        
        {role === 'OHO' && (
          <button 
            onClick={onAdd}
            className="px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('add_vaccination')}
          </button>
        )}
      </div>

      <DataTable
        data={filteredVaccinations}
        columns={columns}
      />
    </div>
  );
};
