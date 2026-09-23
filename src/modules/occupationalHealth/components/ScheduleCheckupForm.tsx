import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { CheckupType } from '../types';

interface ScheduleCheckupFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ScheduleCheckupForm: React.FC<ScheduleCheckupFormProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    employeeId: '',
    department: '',
    type: 'Periodic' as CheckupType,
    scheduledDate: new Date().toISOString().split('T')[0],
    physician: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full p-2.5 bg-bg-main border border-border-base rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 outline-none transition-all";

  return (
    <form id="schedule-checkup-form" onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {t('type')} *
          </label>
          <select
            className={inputClasses}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as CheckupType })}
          >
            <option value="Periodic">{t('periodic')}</option>
            <option value="Pre-employment">{t('pre_employment')}</option>
            <option value="Return to Work">{t('return_to_work')}</option>
            <option value="Exit">{t('exit')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('date')} *
            </label>
            <input
              required
              type="date"
              className={inputClasses}
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('physician')} *
            </label>
            <input
              required
              placeholder={t('physician_placeholder')}
              className={inputClasses}
              value={formData.physician}
              onChange={(e) => setFormData({ ...formData, physician: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {t('notes')}
          </label>
          <textarea
            rows={3}
            placeholder={t('notes_placeholder')}
            className={inputClasses}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>
    </form>
  );
};
