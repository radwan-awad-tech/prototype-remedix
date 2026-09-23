import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { IncidentType, IncidentSeverity } from '../types';

interface ReportIncidentFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ReportIncidentForm: React.FC<ReportIncidentFormProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    employeeId: '',
    department: '',
    type: 'Injury',
    severity: 'Low' as IncidentSeverity,
    location: '',
    description: '',
    actionTaken: '',
    confidentialNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full p-2.5 bg-bg-main border border-border-base rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 outline-none transition-all";

  return (
    <form id="report-incident-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('employee')} *
            </label>
            <input
              required
              placeholder={t('emp_id_placeholder')}
              className={inputClasses}
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('department')} *
            </label>
            <input
              required
              placeholder={t('dept_placeholder')}
              className={inputClasses}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('type')}
            </label>
            <select
              className={inputClasses}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Injury">{t('injury')}</option>
              <option value="Illness">{t('illness')}</option>
              <option value="Near Miss">{t('near_miss')}</option>
              <option value="Exposure">{t('exposure')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('severity')}
            </label>
            <select
              className={inputClasses}
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as IncidentSeverity })}
            >
              <option value="Low">{t('low')}</option>
              <option value="Medium">{t('medium')}</option>
              <option value="High">{t('high')}</option>
              <option value="Critical">{t('critical')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {t('location')} *
          </label>
          <input
            required
            placeholder={t('location_placeholder')}
            className={inputClasses}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {t('description')} *
          </label>
          <textarea
            required
            rows={3}
            placeholder={t('incident_description_placeholder')}
            className={inputClasses}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {t('action_taken')}
          </label>
          <textarea
            rows={2}
            placeholder={t('action_taken_placeholder')}
            className={inputClasses}
            value={formData.actionTaken}
            onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
          />
        </div>

        <div className="p-4 bg-status-warning/5 rounded-xl border border-status-warning/20">
          <label className="block text-sm font-medium text-status-warning mb-1">
            {t('confidential_notes')} ({t('oho_only')})
          </label>
          <textarea
            rows={2}
            placeholder={t('confidential_notes_placeholder')}
            className={`${inputClasses} bg-white`}
            value={formData.confidentialNotes}
            onChange={(e) => setFormData({ ...formData, confidentialNotes: e.target.value })}
          />
        </div>
      </div>
    </form>
  );
};
