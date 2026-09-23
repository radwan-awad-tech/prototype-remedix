import React from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Vaccination, MedicalCheckup, OHRole } from '../types';
import { AlertTriangle, Calendar, ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface ComplianceAlertsTableProps {
  role: OHRole;
  vaccinations: Vaccination[];
  checkups: MedicalCheckup[];
}

export const ComplianceAlertsTable: React.FC<ComplianceAlertsTableProps> = ({ vaccinations, checkups }) => {
  const { t } = useTranslation();

  // Identify overdue vaccinations
  const overdueVaccinations = vaccinations.filter(v => v.status === 'Overdue' || v.status === 'Due');
  
  // Identify overdue checkups (mock logic: if status is 'Follow-up Required' or 'Scheduled' and date is in the past)
  const today = new Date().toISOString().split('T')[0];
  const pendingCheckups = checkups.filter(c => 
    c.status === 'Follow-up Required' || 
    (c.status === 'Scheduled' && c.date < today)
  );

  const alerts = [
    ...overdueVaccinations.map(v => ({
      id: v.id,
      employeeName: v.employeeName,
      employeeId: v.employeeId,
      type: t('vaccination'),
      issue: `${v.vaccineName} - ${v.status}`,
      severity: v.status === 'Overdue' ? 'High' : 'Medium',
      date: v.nextDoseDate || v.dateAdministered
    })),
    ...pendingCheckups.map(c => ({
      id: c.id,
      employeeName: c.employeeName,
      employeeId: c.employeeId,
      type: t('medical_checkup'),
      issue: c.status,
      severity: c.status === 'Follow-up Required' ? 'High' : 'Medium',
      date: c.date
    }))
  ].sort((a, b) => a.date.localeCompare(b.date));

  const columns = [
    {
      header: t('employee'),
      accessor: (item: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{item.employeeName}</span>
          <span className="text-xs text-text-secondary font-mono">{item.employeeId}</span>
        </div>
      ),
    },
    {
      header: t('type'),
      accessor: (item: any) => (
        <div className="flex items-center gap-2">
          {item.type === t('vaccination') ? <ShieldAlert className="w-4 h-4 text-blue-500" /> : <Calendar className="w-4 h-4 text-amber-500" />}
          <span className="text-sm font-medium">{item.type}</span>
        </div>
      ),
    },
    {
      header: t('issue'),
      accessor: (item: any) => (
        <span className="text-sm text-text-primary">{item.issue}</span>
      ),
    },
    {
      header: t('date'),
      accessor: (item: any) => (
        <span className="text-sm text-text-secondary">{item.date}</span>
      ),
    },
    {
      header: t('severity'),
      accessor: (item: any) => (
        <StatusBadge 
          label={t(item.severity.toLowerCase())} 
          type={item.severity === 'High' ? 'rose' : 'amber'} 
        />
      ),
    },
  ];

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 bg-bg-main/30 rounded-2xl border border-dashed border-border-main">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">{t('no_compliance_alerts')}</h3>
          <p className="text-sm text-text-secondary max-w-xs mx-auto">
            {t('all_employees_compliant')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
        <AlertTriangle className="w-5 h-5 text-rose-500" />
        <p className="text-sm font-medium text-rose-700">
          {alerts.length} {t('active_compliance_alerts_found')}
        </p>
      </div>
      <DataTable
        data={alerts}
        columns={columns}
      />
    </div>
  );
};
