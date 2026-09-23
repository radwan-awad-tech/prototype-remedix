import React, { useState } from 'react';
import { Check, User, Briefcase, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Candidate } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { recruitmentService } from '../../services/recruitmentService';
import { useTranslation } from '../../hooks/useTranslation';

interface ConvertWizardProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onComplete?: () => void;
}

const ConvertWizard: React.FC<ConvertWizardProps> = ({ isOpen, onClose, candidate, onComplete }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    nationality: '',
    department: 'nursing',
    position: 'nurse',
    supervisor: 'Dr. Sarah Mitchell',
    hireDate: new Date().toISOString().split('T')[0],
    role: 'employee',
    permissions: ['self_service_portal']
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: t('recruitment_confirm_data'), icon: User },
    { id: 2, title: t('recruitment_job_assignment'), icon: Briefcase },
    { id: 3, title: t('recruitment_roles_access'), icon: ShieldCheck },
    { id: 4, title: t('recruitment_finalize'), icon: Check },
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = t('field_required');
      if (!formData.email.trim()) {
        newErrors.email = t('field_required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('invalid_email');
      }
      if (!formData.nationality.trim()) newErrors.nationality = t('field_required');
    } else if (step === 2) {
      if (!formData.department) newErrors.department = t('field_required');
      if (!formData.position) newErrors.position = t('field_required');
      if (!formData.supervisor) newErrors.supervisor = t('field_required');
      if (!formData.hireDate) newErrors.hireDate = t('field_required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      try {
        setIsSubmitting(true);
        await recruitmentService.convertCandidateToEmployee(candidate.id, {
          department: formData.department,
          position: formData.position,
          supervisor: formData.supervisor,
          hireDate: formData.hireDate,
          role: formData.role
        });
        showToast(`Candidate ${candidate.name} successfully converted to Employee.`, 'success');
        onComplete?.(); // Assuming we might want to refresh parent data
        onClose();
        // Reset state after close
        setTimeout(() => {
          setCurrentStep(1);
          setErrors({});
        }, 300);
      } catch (error) {
        showToast('Failed to convert candidate.', 'error');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{t('recruitment_review_confirm_data')}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('full_name')} *</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-2 rounded-lg border mt-1 outline-none transition-all focus:ring-2 focus:ring-brand-primary-start/20 ${errors.name ? 'border-rose-500' : 'border-slate-200'}`} 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={t('full_name_placeholder')}
                />
                {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('email')} *</label>
                <input 
                  type="email" 
                  className={`w-full px-4 py-2 rounded-lg border mt-1 outline-none transition-all focus:ring-2 focus:ring-brand-primary-start/20 ${errors.email ? 'border-rose-500' : 'border-slate-200'}`} 
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={t('email_placeholder')}
                />
                {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('phone')}</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 mt-1 outline-none focus:ring-2 focus:ring-brand-primary-start/20" 
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder={t('phone_placeholder')}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('nationality')} *</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-2 rounded-lg border mt-1 outline-none transition-all focus:ring-2 focus:ring-brand-primary-start/20 ${errors.nationality ? 'border-rose-500' : 'border-slate-200'}`} 
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  placeholder={t('nationality_placeholder')} 
                />
                {errors.nationality && <p className="text-[10px] text-rose-500 mt-1">{errors.nationality}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{t('recruitment_assign_employee_dept')}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('department')} *</label>
                <select 
                  className={`w-full px-4 py-2 rounded-lg border mt-1 outline-none transition-all focus:ring-2 focus:ring-brand-primary-start/20 ${errors.department ? 'border-rose-500' : 'border-slate-200'}`}
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                >
                  <option value="">{t('select_department')}</option>
                  <option value="nursing">{t('nursing')}</option>
                  <option value="emergency">{t('emergency')}</option>
                  <option value="cardiology">{t('cardiology')}</option>
                </select>
                {errors.department && <p className="text-[10px] text-rose-500 mt-1">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('position')} *</label>
                <select 
                  className={`w-full px-4 py-2 rounded-lg border mt-1 outline-none transition-all focus:ring-2 focus:ring-brand-primary-start/20 ${errors.position ? 'border-rose-500' : 'border-slate-200'}`}
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                >
                  <option value="">{t('select_position')}</option>
                  <option value="nurse">{t('nurse')}</option>
                  <option value="doctor">{t('doctor')}</option>
                  <option value="technician">{t('technician')}</option>
                </select>
                {errors.position && <p className="text-[10px] text-rose-500 mt-1">{errors.position}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('supervisor')} *</label>
                <select 
                  className={`w-full px-4 py-2 rounded-lg border mt-1 outline-none transition-all focus:ring-2 focus:ring-brand-primary-start/20 ${errors.supervisor ? 'border-rose-500' : 'border-slate-200'}`}
                  value={formData.supervisor}
                  onChange={(e) => handleChange('supervisor', e.target.value)}
                >
                  <option value="">{t('select_supervisor')}</option>
                  <option value="Dr. Sarah Mitchell">Dr. Sarah Mitchell</option>
                  <option value="John Doe">John Doe</option>
                </select>
                {errors.supervisor && <p className="text-[10px] text-rose-500 mt-1">{errors.supervisor}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">{t('hire_date')} *</label>
                <input 
                  type="date" 
                  className={`w-full px-4 py-2 rounded-lg border mt-1 outline-none transition-all focus:ring-2 focus:ring-brand-primary-start/20 ${errors.hireDate ? 'border-rose-500' : 'border-slate-200'}`} 
                  value={formData.hireDate}
                  onChange={(e) => handleChange('hireDate', e.target.value)}
                />
                {errors.hireDate && <p className="text-[10px] text-rose-500 mt-1">{errors.hireDate}</p>}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{t('recruitment_setup_access_roles')}</p>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase">{t('primary_role')}</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  <option value="employee">{t('employee')}</option>
                  <option value="department_head">{t('department_head')}</option>
                  <option value="hr_officer">{t('hr_officer')}</option>
                </select>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">{t('recruitment_permissions')}</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.permissions.includes('self_service_portal')} 
                        onChange={(e) => {
                          const newPerms = e.target.checked 
                            ? [...formData.permissions, 'self_service_portal']
                            : formData.permissions.filter(p => p !== 'self_service_portal');
                          handleChange('permissions', newPerms);
                        }}
                      /> {t('self_service_portal')}
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.permissions.includes('attendance_management')} 
                        onChange={(e) => {
                          const newPerms = e.target.checked 
                            ? [...formData.permissions, 'attendance_management']
                            : formData.permissions.filter(p => p !== 'attendance_management');
                          handleChange('permissions', newPerms);
                        }}
                      /> {t('attendance_management')}
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.permissions.includes('scheduling_access')} 
                        onChange={(e) => {
                          const newPerms = e.target.checked 
                            ? [...formData.permissions, 'scheduling_access']
                            : formData.permissions.filter(p => p !== 'scheduling_access');
                          handleChange('permissions', newPerms);
                        }}
                      /> {t('scheduling_access')}
                    </label>
                  </div>
                </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Check size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('recruitment_ready_finalize')}</h3>
            <p className="text-sm text-slate-600 max-w-xs">
              {t('recruitment_review_confirm_data')}
            </p>
            <div className="w-full max-w-sm bg-slate-50 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase font-semibold">{t('name')}:</span>
                <span className="text-slate-900 font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase font-semibold">{t('department')}:</span>
                <span className="text-slate-900 font-medium">{t(formData.department as any)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase font-semibold">{t('position')}:</span>
                <span className="text-slate-900 font-medium">{t(formData.position as any)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase font-semibold">{t('hire_date')}:</span>
                <span className="text-slate-900 font-medium">{formData.hireDate}</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('recruitment_convert_candidate')}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-8">
        {/* Progress Bar */}
        <div className="relative flex justify-between">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-brand-primary-end text-white ring-4 ring-brand-primary-start/20' : 
                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-brand-primary-end' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft size={18} />
            {t('recruitment_back')}
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 btn-gradient-primary rounded-lg font-medium transition-all shadow-sm disabled:opacity-50"
          >
            {isSubmitting && currentStep === steps.length && (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
            {currentStep === steps.length ? t('recruitment_finalize_create') : t('recruitment_next')}
            {currentStep < steps.length && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConvertWizard;
