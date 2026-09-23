import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Briefcase, Shield, FileText, ChevronRight, ChevronLeft, Save, X, AlertCircle, Search, CheckCircle2, UserPlus, Link2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { recruitmentService } from '../../services/recruitmentService';
import { Candidate } from '../../types';

interface WizardProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const AddEmployeeWizard: React.FC<WizardProps> = ({ onClose, onComplete }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [onboardingPath, setOnboardingPath] = useState<'manual' | 'recruitment' | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    createLogin: false,
    role: 'Employee',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (onboardingPath === 'recruitment') {
      const fetchCandidates = async () => {
        setIsLoading(true);
        try {
          const response = await recruitmentService.listCandidates();
          // Filter only those in 'Offer' or 'Interview' stage for onboarding
          if (response.success && response.data) {
            setCandidates(response.data.filter(c => c.stage === 'Offer' || c.stage === 'Interview'));
          }
        } catch (error) {
          console.error('Failed to fetch candidates', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCandidates();
    }
  }, [onboardingPath]);

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const handleCancel = () => {
    const hasData = formData.firstName || formData.lastName || formData.email || onboardingPath;
    if (hasData) {
      setIsCancelConfirmOpen(true);
    } else {
      onClose();
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      if (!onboardingPath) return false;
      if (onboardingPath === 'recruitment' && !selectedCandidate) return false;
      return true;
    }

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = t('field_required');
      if (!formData.lastName.trim()) newErrors.lastName = t('field_required');
      if (!formData.email.trim()) {
        newErrors.email = t('field_required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('invalid_email');
      }
    } else if (currentStep === 2) {
      if (!formData.department) newErrors.department = t('field_required');
      if (!formData.position.trim()) newErrors.position = t('field_required');
      if (!formData.hireDate) newErrors.hireDate = t('field_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step === 0 && onboardingPath === 'recruitment' && selectedCandidate) {
        // Pre-fill form from candidate
        const [first, ...last] = selectedCandidate.name.split(' ');
        setFormData(prev => ({
          ...prev,
          firstName: first,
          lastName: last.join(' '),
          email: selectedCandidate.email,
          phone: selectedCandidate.phone,
        }));
      }
      setStep(s => s + 1);
    }
  };
  const prevStep = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const steps = [
    { id: 0, title: t('onboarding_path'), icon: <Link2 className="w-4 h-4" /> },
    { id: 1, title: t('basic_info'), icon: <User className="w-4 h-4" /> },
    { id: 2, title: t('job_assignment'), icon: <Briefcase className="w-4 h-4" /> },
    { id: 3, title: t('access_roles'), icon: <Shield className="w-4 h-4" /> },
    { id: 4, title: t('upload_documents'), icon: <FileText className="w-4 h-4" /> },
  ];

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

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s.id ? 'bg-brand-primary-end text-white' : 'bg-bg-main text-text-secondary'
              }`}>
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                step >= s.id ? 'text-brand-primary-end' : 'text-text-secondary'
              }`}>{s.title}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-6 ${step > s.id ? 'bg-brand-primary-end' : 'bg-bg-main'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-2">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-text-primary">{t('onboarding_path')}</h3>
                <p className="text-sm text-text-secondary">{t('onboarding_path_desc')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setOnboardingPath('manual')}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 ${
                    onboardingPath === 'manual' 
                      ? 'border-brand-primary-end bg-brand-primary-start/5' 
                      : 'border-border-base hover:border-brand-primary-start/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    onboardingPath === 'manual' ? 'bg-brand-primary-end text-white' : 'bg-bg-main text-text-secondary'
                  }`}>
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{t('manual_entry')}</p>
                    <p className="text-xs text-text-secondary mt-1">{t('manual_entry_desc')}</p>
                  </div>
                </button>

                <button
                  onClick={() => setOnboardingPath('recruitment')}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 ${
                    onboardingPath === 'recruitment' 
                      ? 'border-brand-primary-end bg-brand-primary-start/5' 
                      : 'border-border-base hover:border-brand-primary-start/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    onboardingPath === 'recruitment' ? 'bg-brand-primary-end text-white' : 'bg-bg-main text-text-secondary'
                  }`}>
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{t('link_candidate')}</p>
                    <p className="text-xs text-text-secondary mt-1">{t('link_candidate_desc')}</p>
                  </div>
                </button>
              </div>

              {onboardingPath === 'recruitment' && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input 
                      type="text"
                      placeholder={t('search_candidate_placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full ps-10 pe-4 py-2.5 bg-bg-main border border-border-base rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary-start/20 transition-all"
                    />
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {isLoading ? (
                      <div className="py-8 text-center text-text-secondary text-sm">{t('loading_candidates')}</div>
                    ) : filteredCandidates.length > 0 ? (
                      filteredCandidates.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCandidate(c)}
                          className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between group ${
                            selectedCandidate?.id === c.id 
                              ? 'border-brand-primary-end bg-brand-primary-start/5' 
                              : 'border-border-base hover:bg-bg-main'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center text-brand-primary-end font-bold">
                              {c.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary">{c.name}</p>
                              <p className="text-[10px] text-text-secondary">{c.email} • {c.education}</p>
                            </div>
                          </div>
                          {selectedCandidate?.id === c.id ? (
                            <CheckCircle2 className="w-5 h-5 text-brand-primary-end" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-border-base group-hover:border-brand-primary-start/50" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="py-8 text-center text-text-secondary text-sm">{t('no_candidates_found')}</div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {selectedCandidate && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><Link2 className="w-4 h-4" /></div>
                    <div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">{t('selected_candidate')}</p>
                      <p className="text-sm font-bold text-emerald-900">{selectedCandidate.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setStep(0);
                      setSelectedCandidate(null);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    {t('change_candidate')}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">{t('first_name')} <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full p-2.5 bg-bg-main border rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all ${
                      errors.firstName ? 'border-rose-500' : 'border-border-base'
                    }`}
                    placeholder={t('first_name_placeholder')}
                  />
                  {errors.firstName && (
                    <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">{t('last_name')} <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`w-full p-2.5 bg-bg-main border rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all ${
                      errors.lastName ? 'border-rose-500' : 'border-border-base'
                    }`}
                    placeholder={t('last_name_placeholder')}
                  />
                  {errors.lastName && (
                    <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">{t('email')} <span className="text-rose-500">*</span></label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full p-2.5 bg-bg-main border rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all ${
                    errors.email ? 'border-rose-500' : 'border-border-base'
                  }`}
                  placeholder={t('email_placeholder')}
                />
                {errors.email && (
                  <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">{t('phone')}</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full p-2.5 bg-bg-main border border-border-base rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                  placeholder={t('phone_placeholder')}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">{t('department')} <span className="text-rose-500">*</span></label>
                <select 
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full p-2.5 bg-bg-main border rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all ${
                    errors.department ? 'border-rose-500' : 'border-border-base'
                  }`}
                >
                  <option value="">{t('select_department')}</option>
                  <option value="Nursing">{t('nursing')}</option>
                  <option value="Emergency">{t('emergency')}</option>
                  <option value="Radiology">{t('radiology')}</option>
                  <option value="Administration">{t('administration')}</option>
                </select>
                {errors.department && (
                  <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.department}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">{t('position')} <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className={`w-full p-2.5 bg-bg-main border rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all ${
                    errors.position ? 'border-rose-500' : 'border-border-base'
                  }`}
                  placeholder={t('position_placeholder')}
                />
                {errors.position && (
                  <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.position}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">{t('hire_date')} <span className="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.hireDate}
                  onChange={(e) => handleChange('hireDate', e.target.value)}
                  className={`w-full p-2.5 bg-bg-main border rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all ${
                    errors.hireDate ? 'border-rose-500' : 'border-border-base'
                  }`}
                />
                {errors.hireDate && (
                  <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.hireDate}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between p-4 bg-bg-main rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{t('create_system_login')}</p>
                  <p className="text-xs text-text-secondary">{t('system_login_desc')}</p>
                </div>
                <button 
                  onClick={() => handleChange('createLogin', !formData.createLogin)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.createLogin ? 'bg-brand-primary-end' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.createLogin ? 'start-7' : 'start-1'}`} />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">{t('primary_role')}</label>
                <select 
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full p-2.5 bg-bg-main border border-border-base rounded-lg text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                >
                  <option value="Employee">{t('employee')}</option>
                  <option value="Department Head">{t('dept_head')}</option>
                  <option value="HR Officer">{t('hr_officer')}</option>
                  <option value="System Admin">{t('system_admin')}</option>
                </select>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-8 border-2 border-dashed border-border-base rounded-2xl flex flex-col items-center justify-center text-center hover:border-brand-primary-start/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-bg-main rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-text-secondary" />
                </div>
                <p className="text-sm font-semibold text-text-primary">{t('upload_documents')}</p>
                <p className="text-xs text-text-secondary mt-1">{t('upload_documents_desc')}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('required_documents')}</p>
                <div className="flex items-center justify-between p-3 bg-bg-main rounded-lg">
                  <span className="text-xs text-text-primary">{t('doc_national_id')}</span>
                  <span className="text-[10px] font-bold text-rose-500 uppercase">{t('missing')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-main rounded-lg">
                  <span className="text-xs text-text-primary">{t('doc_professional_license')}</span>
                  <span className="text-[10px] font-bold text-rose-500 uppercase">{t('missing')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-border-base mt-8">
        <button 
          onClick={step === 0 ? handleCancel : prevStep}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-lg transition-colors"
        >
          {step === 0 ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {step === 0 ? t('cancel') : t('back')}
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => showToast(t('draft_saving_soon'), 'info')}
            className="px-4 py-2 text-sm font-medium text-brand-primary-end hover:bg-brand-primary-start/5 rounded-lg transition-colors"
          >
            {t('save_draft')}
          </button>
          <button 
            onClick={step === 4 ? () => onComplete(formData) : nextStep}
            className="btn-gradient-primary flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium"
          >
            {step === 4 ? t('submit') : t('next')}
            {step !== 4 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        title={t('confirm_cancel')}
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsCancelConfirmOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('no_keep_editing')}
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-rose-600 rounded-xl text-sm font-bold text-white hover:bg-rose-700 transition-colors"
            >
              {t('yes_cancel')}
            </button>
          </div>
        }
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {t('unsaved_changes')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('cancel_confirm_msg')}
          </p>
        </div>
      </Modal>
    </div>
  );
};
