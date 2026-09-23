import React, { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FollowUp, OHRole } from '../types';
import { Search, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface FollowUpsTableProps {
  role: OHRole;
  data: FollowUp[];
  onComplete?: (id: string) => void;
}

export const FollowUpsTable: React.FC<FollowUpsTableProps> = ({ role, data, onComplete }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFollowUps = data.filter(fol => 
    (fol.employeeName && fol.employeeName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (fol.task && fol.task.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (fol.employeeId && fol.employeeId.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  const columns = [
    {
      header: t('employee'),
      accessor: (item: FollowUp) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{item.employeeName}</span>
          <span className="text-xs text-text-secondary font-mono">{item.employeeId}</span>
        </div>
      ),
    },
    {
      header: t('type'),
      accessor: (item: FollowUp) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.task}</span>
          <span className="text-xs text-text-secondary">{item.caseType}: {item.caseId}</span>
        </div>
      ),
    },
    {
      header: t('date'),
      accessor: (item: FollowUp) => (
        <span className="text-sm text-text-primary">{item.dueDate}</span>
      ),
    },
    {
      header: t('assigned_to'),
      accessor: (item: FollowUp) => (
        <span className="text-sm text-text-primary">{item.assignedTo}</span>
      ),
    },
    {
      header: t('status'),
      accessor: (item: FollowUp) => {
        const colors: Record<string, string> = {
          'Completed': 'emerald',
          'Pending': 'blue',
          'Overdue': 'rose'
        };
        const labelKey = `status_${item.status.toLowerCase()}` as any;
        return <StatusBadge label={t(labelKey)} type={colors[item.status] as any} />;
      },
    },
    {
      header: t('actions'),
      accessor: (item: FollowUp) => (
        <div className="flex items-center gap-2">
          {role === 'OHO' && item.status !== 'Completed' && (
            <button 
              onClick={() => onComplete?.(item.id)}
              className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
              title={t('mark_completed')}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <input
            type="text"
            placeholder={t('search_follow_ups')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-border-main bg-white focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main outline-none text-sm transition-all"
          />
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>
      </div>

      <DataTable
        data={filteredFollowUps}
        columns={columns}
      />
    </div>
  );
};
