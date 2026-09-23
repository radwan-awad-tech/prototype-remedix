import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { VaccinationStatus } from '../types';

interface AddVaccinationFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const AddVaccinationForm: React.FC<AddVaccinationFormProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    employeeId: '',
    department: '',
    vaccineName: '',
    doseNumber: 1,
    totalDoses: 1,
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDoseDate: '',
    provider: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full p-2.5 bg-bg-main border border-border-base rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 outline-none transition-all";

  return (
    <form id="add-vaccination-form" onSubmit={handleSubmit} className="space-y-6">
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
            {t('vaccine_name')} *
          </label>
          <input
            required
            placeholder={t('vaccine_placeholder')}
            className={inputClasses}
            value={formData.vaccineName}
            onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('dose')} *
            </label>
            <input
              required
              type="number"
              min="1"
              className={inputClasses}
              value={formData.doseNumber}
              onChange={(e) => setFormData({ ...formData, doseNumber: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('date')} *
            </label>
            <input
              required
              type="date"
              className={inputClasses}
              value={formData.dateAdministered}
              onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {t('provider')} *
          </label>
          <input
            required
            placeholder={t('provider_placeholder')}
            className={inputClasses}
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {t('next_checkup_date')}
          </label>
          <input
            type="date"
            className={inputClasses}
            value={formData.nextDoseDate}
            onChange={(e) => setFormData({ ...formData, nextDoseDate: e.target.value })}
          />
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
