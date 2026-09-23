import React, { useState, useMemo } from 'react';
import { Search, User, FileText, Award, CheckCircle2, ChevronRight, ChevronLeft, Upload, X, Link2, UserPlus, Users } from 'lucide-react';
import { Employee, Doctor, DoctorSpecialty, Candidate } from '../../../types';
import { MOCK_EMPLOYEES, MOCK_SPECIALTIES, MOCK_DOCTORS } from '../../../mockData';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useTranslation } from '../../../hooks/useTranslation';
import { TranslationKey } from '../../../i18n/translations';
import { recruitmentService } from '../../../services/recruitmentService';
import { useEffect } from 'react';

interface AddDoctorWizardProps {
  onCancel: () => void;
  onComplete: (doctor: Doctor) => void;
  initialDoctor?: Doctor;
}

type WizardStep = 'Link Employee' | 'Core Data' | 'Specialties' | 'Documents';

export const AddDoctorWizard: React.FC<AddDoctorWizardProps> = ({ onCancel, onComplete, initialDoctor }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<WizardStep>('Link Employee');
  const [onboardingPath, setOnboardingPath] = useState<'existing' | 'new' | 'recruitment'>(
    initialDoctor ? 'existing' : 'existing'
  );
  const [newEmployeeData, setNewEmployeeData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: 'Doctor'
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    initialDoctor ? MOCK_EMPLOYEES.find(e => e.id === initialDoctor.employeeId) || null : null
  );
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (onboardingPath === 'recruitment' && candidates.length === 0) {
      const fetchCandidates = async () => {
        setIsLoadingCandidates(true);
        try {
          const response = await recruitmentService.listCandidates();
          if (response.success) {
            // Filter candidates in advanced stages
            setCandidates(response.data.filter(c => ['Interview', 'Offer', 'Hired'].includes(c.stage)));
          }
        } catch (error) {
          console.error('Failed to fetch candidates', error);
        } finally {
          setIsLoadingCandidates(false);
        }
      };
      fetchCandidates();
    }
  }, [onboardingPath, candidates.length]);
  
  // Form State
  const [doctorData, setDoctorData] = useState<Partial<Doctor>>(
    initialDoctor || {
      doctorCode: `DOC-${String(MOCK_DOCTORS.length + 1).padStart(3, '0')}`,
      medicalLicenseNumber: '',
      licensingAuthority: 'Ministry of Health',
      licenseIssueDate: '',
      licenseExpiryDate: '',
      availabilityStatus: 'Available',
      specialties: [],
      primarySpecialty: '',
      status: 'Active',
      notes: ''
    }
  );

  const [uploadedDocs, setUploadedDocs] = useState<{ type: string; name: string }[]>([]);

  const steps: WizardStep[] = ['Link Employee', 'Core Data', 'Specialties', 'Documents'];

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return MOCK_EMPLOYEES.filter(emp => {
      const isAlreadyDoctor = MOCK_DOCTORS.some(doc => doc.employeeId === emp.id && doc.id !== initialDoctor?.id);
      const isActive = emp.status === 'Active';
      const searchStr = `${emp.firstName} ${emp.lastName} ${emp.employeeNo} ${emp.phone}`.toLowerCase();
      return isActive && !isAlreadyDoctor && searchStr.includes((searchTerm || '').toLowerCase());
    });
  }, [searchTerm, initialDoctor]);

  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) return candidates;
    return candidates.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, candidates]);

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      // If moving from first step and recruitment is selected, pre-fill newEmployeeData
      if (currentStep === 'Link Employee' && onboardingPath === 'recruitment' && selectedCandidate) {
        const [first, ...last] = selectedCandidate.name.split(' ');
        setNewEmployeeData({
          firstName: first || '',
          lastName: last.join(' ') || '',
          email: selectedCandidate.email,
          phone: selectedCandidate.phone,
          department: '', // To be filled or inferred
          position: 'Doctor'
        });
      }
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      // Final Submit
      const finalEmployeeId = (onboardingPath === 'new' || onboardingPath === 'recruitment')
        ? `emp-${Date.now()}` 
        : selectedEmployee?.id || '';
        
      const newDoctor: Doctor = {
        ...doctorData as Doctor,
        id: initialDoctor?.id || `doc-${Date.now()}`,
        employeeId: finalEmployeeId,
      };
      onComplete(newDoctor);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'Link Employee':
        if (onboardingPath === 'new') {
          return !!newEmployeeData.firstName && !!newEmployeeData.lastName && !!newEmployeeData.email;
        }
        if (onboardingPath === 'recruitment') {
          return !!selectedCandidate;
        }
        return !!selectedEmployee;
      case 'Core Data':
        return !!doctorData.medicalLicenseNumber && !!doctorData.licenseExpiryDate;
      case 'Specialties':
        return !!doctorData.primarySpecialty;
      case 'Documents':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-border-base">
      {/* Wizard Header */}
      <div className="bg-bg-main p-6 border-b border-border-base">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{initialDoctor ? t('edit_doctor') : t('onboard_doctor')}</h2>
            <p className="text-sm text-text-secondary">{t('wizard_subtitle')}</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-base -translate-y-1/2 z-0"></div>
          {steps.map((step, idx) => {
            const isActive = step === currentStep;
            const isCompleted = steps.indexOf(step) < steps.indexOf(currentStep);
            
            const stepKey = step ? step.toLowerCase().replace(' ', '_') as any : '';

            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-primary text-white shadow-lg scale-110' 
                      : isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white border-2 border-border-base text-text-secondary'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span>{idx + 1}</span>}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-brand-primary-start' : 'text-text-secondary'}`}>
                  {t(stepKey)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto">
          {currentStep === 'Link Employee' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!initialDoctor && (
                <div className="flex gap-2 p-1 bg-bg-main rounded-xl border border-border-base">
                  <button
                    onClick={() => setOnboardingPath('existing')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${onboardingPath === 'existing' ? 'bg-white shadow-sm text-brand-primary-start' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    {t('link_existing_employee')}
                  </button>
                  <button
                    onClick={() => setOnboardingPath('new')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${onboardingPath === 'new' ? 'bg-white shadow-sm text-brand-primary-start' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {t('create_new_employee')}
                  </button>
                  <button
                    onClick={() => setOnboardingPath('recruitment')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${onboardingPath === 'recruitment' ? 'bg-white shadow-sm text-brand-primary-start' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {t('link_candidate')}
                  </button>
                </div>
              )}

              {onboardingPath === 'new' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('first_name')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={newEmployeeData.firstName}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                      placeholder={t('first_name')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('last_name')} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={newEmployeeData.lastName}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                      placeholder={t('last_name')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('email')} <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      value={newEmployeeData.email}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                      placeholder={t('email_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('phone')}</label>
                    <input
                      type="tel"
                      value={newEmployeeData.phone}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                      placeholder={t('phone_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('department')}</label>
                    <input
                      type="text"
                      value={newEmployeeData.department}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, department: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                      placeholder={t('department')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('position')}</label>
                    <input
                      type="text"
                      value={newEmployeeData.position}
                      readOnly
                      className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm opacity-60"
                    />
                  </div>
                </div>
              ) : onboardingPath === 'recruitment' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">{t('search_candidate')}</label>
                    <div className="relative">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="text"
                        placeholder={t('search_candidate_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full ps-10 pe-4 py-3 bg-bg-main border border-border-base rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                      />
                    </div>
                  </div>

                  {selectedCandidate ? (
                    <div className="p-6 bg-brand-primary-start/5 border border-brand-primary-start/20 rounded-2xl flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-brand-primary-start text-white flex items-center justify-center font-bold text-xl">
                        {selectedCandidate.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-text-primary">{selectedCandidate.name}</h3>
                          <StatusBadge status={selectedCandidate.stage} />
                        </div>
                        <p className="text-sm text-text-secondary">{selectedCandidate.email} • {selectedCandidate.phone}</p>
                        <p className="text-xs text-text-secondary mt-1">{selectedCandidate.education}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedCandidate(null)}
                        className="p-2 hover:bg-brand-primary-start/10 rounded-lg text-brand-primary-end transition-colors"
                      >
                        {t('change')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {isLoadingCandidates ? (
                        <div className="p-12 text-center bg-bg-main rounded-xl border border-dashed border-border-base">
                          <div className="w-8 h-8 border-4 border-brand-primary-start border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-sm text-text-secondary">{t('loading_candidates')}</p>
                        </div>
                      ) : filteredCandidates.length > 0 ? (
                        <div className="border border-border-base rounded-xl divide-y divide-border-base overflow-hidden shadow-sm">
                          {filteredCandidates.map(cand => (
                            <button
                              key={cand.id}
                              onClick={() => setSelectedCandidate(cand)}
                              className="w-full p-4 flex items-center gap-4 hover:bg-bg-main transition-colors text-left"
                            >
                              <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center text-text-secondary font-semibold">
                                {cand.name[0]}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-text-primary">{cand.name}</p>
                                <p className="text-xs text-text-secondary">{cand.email} • {cand.stage}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-text-secondary" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center bg-bg-main rounded-xl border border-dashed border-border-base">
                          <Link2 className="w-8 h-8 text-text-secondary mx-auto mb-2 opacity-20" />
                          <p className="text-sm text-text-secondary italic">{t('no_candidates_found')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">{t('search_employee')}</label>
                    <div className="relative">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="text"
                        placeholder={t('search_employee_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full ps-10 pe-4 py-3 bg-bg-main border border-border-base rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                      />
                    </div>
                  </div>

                  {selectedEmployee ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xl">
                        {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-text-primary">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                          <StatusBadge status="Active" translationKey="active" />
                        </div>
                        <p className="text-sm text-text-secondary">{selectedEmployee.position ? t(selectedEmployee.position.toLowerCase() as TranslationKey) : ''} • {selectedEmployee.department ? t(selectedEmployee.department.toLowerCase() as TranslationKey) : ''}</p>
                        <p className="text-xs text-text-secondary mt-1">{selectedEmployee.email} • {selectedEmployee.phone}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedEmployee(null)}
                        className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                      >
                        {t('change')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchTerm && filteredEmployees.length > 0 ? (
                        <div className="border border-border-base rounded-xl divide-y divide-border-base overflow-hidden shadow-sm">
                          {filteredEmployees.map(emp => (
                            <button
                              key={emp.id}
                              onClick={() => setSelectedEmployee(emp)}
                              className="w-full p-4 flex items-center gap-4 hover:bg-bg-main transition-colors text-left"
                            >
                              <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center text-text-secondary font-semibold">
                                {emp.firstName[0]}{emp.lastName[0]}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-text-primary">{emp.firstName} {emp.lastName}</p>
                                <p className="text-xs text-text-secondary">{emp.employeeNo} • {emp.position ? t(emp.position.toLowerCase() as TranslationKey) : ''}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-text-secondary" />
                            </button>
                          ))}
                        </div>
                      ) : searchTerm ? (
                        <div className="p-8 text-center bg-bg-main rounded-xl border border-dashed border-border-base">
                          <p className="text-sm text-text-secondary">{t('no_eligible_employees')}</p>
                        </div>
                      ) : (
                        <div className="p-12 text-center bg-bg-main rounded-xl border border-dashed border-border-base">
                          <User className="w-8 h-8 text-text-secondary mx-auto mb-2 opacity-20" />
                          <p className="text-sm text-text-secondary italic">{t('search_to_begin')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 'Core Data' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('doctor_code')}</label>
                  <input
                    type="text"
                    value={doctorData.doctorCode}
                    readOnly
                    className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm font-mono text-brand-primary-start"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('medical_license_no')} <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={doctorData.medicalLicenseNumber}
                    onChange={(e) => setDoctorData({ ...doctorData, medicalLicenseNumber: e.target.value })}
                    placeholder={t('license_placeholder')}
                    className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('licensing_authority')}</label>
                  <input
                    type="text"
                    value={doctorData.licensingAuthority}
                    onChange={(e) => setDoctorData({ ...doctorData, licensingAuthority: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('availability_status')}</label>
                  <select
                    value={doctorData.availabilityStatus}
                    onChange={(e) => setDoctorData({ ...doctorData, availabilityStatus: e.target.value as any })}
                    className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                  >
                    <option value="Available">{t('available')}</option>
                    <option value="Busy">{t('busy')}</option>
                    <option value="On Leave">{t('on_leave')}</option>
                    <option value="Not Available">{t('not_available')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('issue_date')}</label>
                  <input
                    type="date"
                    value={doctorData.licenseIssueDate}
                    onChange={(e) => setDoctorData({ ...doctorData, licenseIssueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('expiry_date')} <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    value={doctorData.licenseExpiryDate}
                    onChange={(e) => setDoctorData({ ...doctorData, licenseExpiryDate: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('notes')}</label>
                <textarea
                  value={doctorData.notes}
                  onChange={(e) => setDoctorData({ ...doctorData, notes: e.target.value })}
                  placeholder={t('notes_placeholder')}
                  className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {currentStep === 'Specialties' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('primary_specialty')} <span className="text-rose-500">*</span></label>
                <select
                  value={doctorData.primarySpecialty}
                  onChange={(e) => {
                    const val = e.target.value;
                    const currentSpecs = doctorData.specialties || [];
                    const newSpecs = currentSpecs.includes(val) ? currentSpecs : [...currentSpecs, val];
                    setDoctorData({ ...doctorData, primarySpecialty: val, specialties: newSpecs });
                  }}
                  className="w-full px-4 py-3 bg-bg-main border border-border-base rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                >
                  <option value="">{t('select_primary_specialty')}</option>
                  {MOCK_SPECIALTIES.map(s => (
                    <option key={s.id} value={s.name}>{s.name ? t(s.name.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('additional_specialties')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {MOCK_SPECIALTIES.map(s => {
                    const isSelected = doctorData.specialties?.includes(s.name);
                    const isPrimary = doctorData.primarySpecialty === s.name;
                    
                    return (
                      <button
                        key={s.id}
                        disabled={isPrimary}
                        onClick={() => {
                          const currentSpecs = doctorData.specialties || [];
                          const newSpecs = isSelected 
                            ? currentSpecs.filter(spec => spec !== s.name)
                            : [...currentSpecs, s.name];
                          setDoctorData({ ...doctorData, specialties: newSpecs });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-brand-primary-start/5 border-brand-primary-start text-brand-primary-start' 
                            : 'bg-white border-border-base text-text-secondary hover:border-brand-primary-start/50'
                        } ${isPrimary ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-sm font-medium">{s.name ? t(s.name.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'Documents' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 border-2 border-dashed border-border-base rounded-2xl bg-bg-main flex flex-col items-center justify-center text-center group hover:border-brand-primary-start transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-text-secondary mb-4 group-hover:text-brand-primary-start transition-colors shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-text-primary mb-1">{t('upload_credentials')}</h4>
                <p className="text-sm text-text-secondary mb-4">{t('upload_credentials_desc')}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white rounded border border-border-base text-[10px] font-bold text-text-secondary uppercase tracking-wider">PDF</span>
                  <span className="px-2 py-1 bg-white rounded border border-border-base text-[10px] font-bold text-text-secondary uppercase tracking-wider">JPG</span>
                  <span className="px-2 py-1 bg-white rounded border border-border-base text-[10px] font-bold text-text-secondary uppercase tracking-wider">PNG</span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('required_documents')}</h5>
                <div className="space-y-2">
                  {[
                    { type: 'medical_license_scan', required: true },
                    { type: 'board_certification', required: false },
                    { type: 'training_certificate', required: false },
                    { type: 'other_document', required: false },
                  ].map(doc => (
                    <div key={doc.type} className="flex items-center justify-between p-4 bg-white border border-border-base rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{t(doc.type as TranslationKey)}</p>
                          {doc.required && <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">{t('required')}</span>}
                        </div>
                      </div>
                      <button className="text-xs font-bold text-brand-primary-start hover:underline">
                        {t('upload')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wizard Footer */}
      <div className="p-6 border-t border-border-base bg-bg-main flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === steps[0]}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-text-secondary hover:bg-white rounded-xl transition-all disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('back')}
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-bold text-text-secondary hover:bg-white rounded-xl transition-all"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="btn-gradient-primary flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-brand-primary-start/20 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {currentStep === steps[steps.length - 1] ? t('complete_onboarding') : t('continue')}
            {currentStep !== steps[steps.length - 1] && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
