import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, FileText, User, ChevronRight, AlertCircle } from 'lucide-react';
import { LeaveType } from '../../types';
import { TranslationKey } from '../../i18n/translations';
import { useTranslation } from '../../hooks/useTranslation';

interface LeaveRequestFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    leaveType: '' as LeaveType | '',
    startDate: '',
    endDate: '',
    reason: '',
    contactDuringLeave: '',
    replacementEmployeeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.leaveType) newErrors.leaveType = t('leave_type_required');
    if (!formData.startDate) newErrors.startDate = t('start_date_required');
    if (!formData.endDate) newErrors.endDate = t('end_date_required');
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = t('end_date_after_start');
    }
    if (!formData.reason) newErrors.reason = t('reason_required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const leaveTypes: LeaveType[] = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Emergency', 'Compassionate'];

  return (
    <form id="leave-request-form" onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('leave_type')} *</label>
          <select 
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
            className={`w-full p-3 bg-bg-main border ${errors.leaveType ? 'border-rose-500' : 'border-border-base'} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all`}
          >
            <option value="">{t('select_leave_type')}</option>
            {leaveTypes.map(type => <option key={type} value={type}>{t(type.toLowerCase() as TranslationKey)}</option>)}
          </select>
          {errors.leaveType && <p className="text-[10px] text-rose-500 font-medium">{errors.leaveType}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('start_date')} *</label>
            <input 
              type="date" 
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full p-3 bg-bg-main border ${errors.startDate ? 'border-rose-500' : 'border-border-base'} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all`}
            />
            {errors.startDate && <p className="text-[10px] text-rose-500 font-medium">{errors.startDate}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('end_date')} *</label>
            <input 
              type="date" 
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={`w-full p-3 bg-bg-main border ${errors.endDate ? 'border-rose-500' : 'border-border-base'} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all`}
            />
            {errors.endDate && <p className="text-[10px] text-rose-500 font-medium">{errors.endDate}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('reason')} *</label>
          <textarea 
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className={`w-full p-3 bg-bg-main border ${errors.reason ? 'border-rose-500' : 'border-border-base'} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all min-h-[100px]`}
            placeholder={t('leave_reason_placeholder')}
          />
          {errors.reason && <p className="text-[10px] text-rose-500 font-medium">{errors.reason}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('contact_during_leave')}</label>
          <input 
            type="text" 
            value={formData.contactDuringLeave}
            onChange={(e) => setFormData({ ...formData, contactDuringLeave: e.target.value })}
            className="w-full p-3 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all"
            placeholder={t('contact_placeholder')}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('replacement_employee')} ({t('optional')})</label>
          <select 
            value={formData.replacementEmployeeId}
            onChange={(e) => setFormData({ ...formData, replacementEmployeeId: e.target.value })}
            className="w-full p-3 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all"
          >
            <option value="">{t('select_replacement')}</option>
            <option value="2">John Doe (Nursing)</option>
            <option value="3">Jane Smith (Radiology)</option>
          </select>
        </div>

        <div className="p-4 border-2 border-dashed border-border-base rounded-2xl flex flex-col items-center justify-center text-center hover:border-brand-primary-start/50 transition-colors cursor-pointer">
          <FileText className="w-6 h-6 text-text-secondary mb-2" />
          <p className="text-xs font-bold text-text-primary">{t('upload_attachment')}</p>
          <p className="text-[10px] text-text-secondary mt-1">{t('attachment_hint')}</p>
        </div>
      </div>
    </form>
  );
};
