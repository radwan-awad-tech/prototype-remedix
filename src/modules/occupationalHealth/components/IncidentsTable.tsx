import React, { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Incident, OHRole } from '../types';
import { PrivacyValue } from './PrivacyValue';
import { Eye, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface IncidentsTableProps {
  role: OHRole;
  onViewDetails: (incident: Incident) => void;
  onReportIncident: () => void;
  data: Incident[];
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({ role, onViewDetails, onReportIncident, data }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = data.filter(incident => 
    (incident.employeeName && incident.employeeName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (incident.type && incident.type.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (incident.id && incident.id.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  const columns = [
    {
      header: t('employee'),
      accessor: (item: Incident) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{item.employeeName}</span>
          <span className="text-xs text-text-secondary font-mono">{item.employeeId}</span>
        </div>
      ),
    },
    {
      header: t('type'),
      accessor: (item: Incident) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.type}</span>
          <span className="text-xs text-text-secondary">{item.date}</span>
        </div>
      ),
    },
    {
      header: t('severity'),
      accessor: (item: Incident) => {
        const colors: Record<string, string> = {
          'Low': 'blue',
          'Medium': 'amber',
          'High': 'orange',
          'Critical': 'rose'
        };
        const labelKey = `severity_${item.severity.toLowerCase()}` as any;
        return <StatusBadge label={t(labelKey)} type={colors[item.severity] as any} />;
      },
    },
    {
      header: t('status'),
      accessor: (item: Incident) => {
        const colors: Record<string, string> = {
          'Open': 'blue',
          'Under Investigation': 'amber',
          'Resolved': 'emerald',
          'Closed': 'slate'
        };
        const labelKey = `status_${item.status.toLowerCase().replace(/\s+/g, '_')}` as any;
        return <StatusBadge label={t(labelKey)} type={colors[item.status] as any} />;
      },
    },
    {
      header: t('confidential_notes'),
      accessor: (item: Incident) => (
        <PrivacyValue 
          value={item.confidentialNotes || '-'} 
          role={role} 
          requiredRole="OHO" 
          resourceName={`Incident ${item.id} Confidential Notes`}
        />
      ),
    },
    {
      header: t('actions'),
      accessor: (item: Incident) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewDetails(item)}
            className="p-1.5 hover:bg-bg-main rounded-lg transition-colors text-text-secondary hover:text-primary-main"
            title={t('view_details')}
          >
            <Eye className="w-4 h-4" />
          </button>
          {role === 'OHO' && item.status !== 'Closed' && (
            <button 
              className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
              title={t('close_case')}
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
            placeholder={t('search_incidents')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-border-main bg-white focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main outline-none text-sm transition-all"
          />
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>
        
        {role === 'OHO' && (
          <button 
            onClick={onReportIncident}
            className="px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {t('report_incident')}
          </button>
        )}
      </div>

      <DataTable
        data={filteredIncidents}
        columns={columns}
      />
    </div>
  );
};
