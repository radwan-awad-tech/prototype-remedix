import React, { useState } from 'react';
import { 
  X, 
  Edit2, 
  UserMinus, 
  Calendar, 
  FileDown, 
  Stethoscope, 
  Award, 
  ShieldCheck, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Doctor, Employee } from '../../../types';
import { MOCK_EMPLOYEES } from '../../../mockData';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Tabs } from '../../../components/ui/Tabs';
import { useTranslation } from '../../../hooks/useTranslation';
import { TranslationKey } from '../../../i18n/translations';
import { useToast } from '../../../components/ui/Toast';

interface DoctorProfileProps {
  doctor: Doctor;
  onClose: () => void;
  onEdit: (doctor: Doctor) => void;
  onDeactivate: (doctor: Doctor) => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor, onClose, onEdit, onDeactivate }) => {
  const { t } = useTranslation();
  const { info } = useToast();
  const employee = MOCK_EMPLOYEES.find(e => e.id === doctor.employeeId);
  const [activeTab, setActiveTab] = useState('overview');

  if (!employee) return null;

  const tabs = [
    { id: 'overview', label: t('overview'), icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'license', label: t('license_credentials'), icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'specialties', label: t('specialties'), icon: <Award className="w-4 h-4" /> },
    { id: 'schedule', label: t('schedule'), icon: <Calendar className="w-4 h-4" /> },
  ];

  const getLicenseStatus = () => {
    const expiryDate = new Date(doctor.licenseExpiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'Expired', label: t('expired'), translationKey: 'expired' as const };
    if (diffDays <= 30) return { status: 'Expiring', label: t('expiring'), translationKey: 'expiring' as const };
    return { status: 'Valid', label: t('valid'), translationKey: 'valid' as const };
  };

  const licenseStatus = getLicenseStatus();

  return (
    <div className="bg-bg-main scroll-smooth">
      {/* Header */}
      <div className="bg-white border-b border-border-base p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-primary-start/20">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-text-primary">{employee.firstName} {employee.lastName}</h2>
                <StatusBadge status={doctor.status} translationKey={doctor.status?.toLowerCase() as TranslationKey} />
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="font-mono font-medium text-brand-primary-start">{doctor.doctorCode}</span>
                <span>•</span>
                <span>{doctor.primarySpecialty ? t(doctor.primarySpecialty.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${doctor.availabilityStatus === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span>{doctor.availabilityStatus ? t(doctor.availabilityStatus.toLowerCase() as TranslationKey) : ''}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(doctor)}
              className="p-2 hover:bg-bg-main rounded-lg text-text-secondary transition-colors"
              title={t('edit')}
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDeactivate(doctor)}
              className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"
              title={t('deactivate_doctor')}
            >
              <UserMinus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-border-base px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-lg border border-border-base transition-colors">
              <Calendar className="w-4 h-4" />
              {t('view_schedule')}
            </button>
            <button 
              onClick={() => info(t('feature_coming_soon'))}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-lg border border-border-base transition-colors"
            >
              <FileDown className="w-4 h-4" />
              {t('export_pdf')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="w-full space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Left Column: Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card-base p-6">
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">{t('professional_summary')}</h3>
                  <p className="text-text-primary leading-relaxed">
                    {doctor.notes || t('no_records_found')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card-base p-6">
                    <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">{t('employee_details')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{t('employee_id')}</span>
                        <span className="text-sm font-medium text-text-primary">{employee.employeeNo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{t('department')}</span>
                        <span className="text-sm font-medium text-text-primary">{employee.department ? t(employee.department.toLowerCase() as TranslationKey) : ''}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{t('position')}</span>
                        <span className="text-sm font-medium text-text-primary">{employee.position ? t(employee.position.toLowerCase() as TranslationKey) : ''}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{t('hire_date')}</span>
                        <span className="text-sm font-medium text-text-primary">{employee.hireDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-base p-6">
                    <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">{t('availability')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{t('current_status')}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${doctor.availabilityStatus === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          <span className="text-sm font-medium text-text-primary">{doctor.availabilityStatus ? t(doctor.availabilityStatus.toLowerCase() as TranslationKey) : ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{t('next_shift')}</span>
                        <span className="text-sm font-medium text-text-primary">{t('today')}, 08:00 AM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{t('on_call_status')}</span>
                        <span className="text-sm font-medium text-emerald-600">{t('active')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact & Quick Info */}
              <div className="space-y-6">
                <div className="card-base p-6">
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">{t('contact_information')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-secondary">{t('email_address')}</p>
                        <p className="text-sm font-medium text-text-primary truncate">{employee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-secondary">{t('phone_number')}</p>
                        <p className="text-sm font-medium text-text-primary">{employee.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-secondary">{t('address')}</p>
                        <p className="text-sm font-medium text-text-primary truncate">{employee.address || t('no_records_found')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-base p-6 bg-gradient-primary text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6" />
                    <h3 className="font-bold">{t('license_status')}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-3xl font-bold">{licenseStatus.label}</p>
                    <p className="text-sm text-white/80">{t('license_expiry')}: {doctor.licenseExpiryDate}</p>
                  </div>
                  <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors">
                    {t('renew_license')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="card-base p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">{t('medical_license_details')}</h3>
                  <StatusBadge status={licenseStatus.status as any} translationKey={licenseStatus.translationKey} />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">{t('license_number')}</p>
                      <p className="text-lg font-mono font-bold text-text-primary">{doctor.medicalLicenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">{t('licensing_authority')}</p>
                      <p className="text-sm font-medium text-text-primary">{doctor.licensingAuthority || t('no_records_found')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">{t('issue_date')}</p>
                      <p className="text-sm font-medium text-text-primary">{doctor.licenseIssueDate || t('no_records_found')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">{t('expiry_date')}</p>
                      <p className="text-sm font-medium text-text-primary">{doctor.licenseExpiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">{t('credentials_documents')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'medical_license_scan', type: 'PDF', size: '2.4 MB', date: '2023-10-12' },
                    { name: 'board_certification', type: 'PDF', size: '1.8 MB', date: '2023-11-05' },
                    { name: 'specialization_certificate', type: 'JPG', size: '4.2 MB', date: '2023-09-20' },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-bg-main rounded-xl border border-border-base group hover:border-brand-primary-start transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-text-secondary group-hover:text-brand-primary-start transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{t(doc.name as TranslationKey)}</p>
                          <p className="text-xs text-text-secondary">{doc.type} • {doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white rounded-lg text-text-secondary transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specialties' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="card-base p-6">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">{t('specialty_mapping')}</h3>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-4">{t('primary_specialty')}</p>
                    <div className="p-4 bg-brand-primary-start/5 border border-brand-primary-start rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-primary-start text-white flex items-center justify-center">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-brand-primary-start">{doctor.primarySpecialty ? t(doctor.primarySpecialty.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</p>
                        <p className="text-sm text-brand-primary-start/70">{t('primary_specialty_desc')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-4">{t('additional_specialties')}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {doctor.specialties.filter(s => s !== doctor.primarySpecialty).map((spec, idx) => (
                        <div key={idx} className="p-4 bg-white border border-border-base rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary">
                              <Award className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-text-primary">{spec ? t(spec.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-text-secondary" />
                        </div>
                      ))}
                      {doctor.specialties.length <= 1 && (
                        <div className="col-span-2 p-8 text-center bg-bg-main rounded-xl border border-dashed border-border-base">
                          <p className="text-sm text-text-secondary italic">{t('no_records_found')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="card-base p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">{t('weekly_schedule_preview')}</h3>
                  <button className="text-sm font-bold text-brand-primary-start hover:underline">{t('full_calendar_view')}</button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                    <div key={day} className="space-y-2">
                      <div className="text-center py-2 bg-bg-main rounded-lg text-xs font-bold text-text-secondary uppercase">{t(day as TranslationKey)}</div>
                      <div className="h-32 bg-white border border-border-base rounded-lg p-2 flex flex-col gap-1">
                        {day !== 'sat' && day !== 'sun' ? (
                          <div className="flex-1 bg-brand-primary-start/10 border-l-2 border-brand-primary-start rounded p-1">
                            <p className="text-[10px] font-bold text-brand-primary-start">08:00 - 16:00</p>
                            <p className="text-[8px] text-brand-primary-start/70">{t('day_shift')}</p>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <span className="text-[10px] text-text-secondary italic">{t('off')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">{t('upcoming_appointments')}</h3>
                <div className="space-y-3">
                  {[
                    { time: '09:00 AM', patient: 'Patient #4412', type: 'consultation', status: 'confirmed' },
                    { time: '10:30 AM', patient: 'Patient #8821', type: 'follow_up', status: 'pending' },
                    { time: '01:00 PM', patient: 'Patient #1229', type: 'surgery_prep', status: 'confirmed' },
                  ].map((appt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-bg-main rounded-lg border border-border-base">
                      <div className="flex items-center gap-4">
                        <div className="w-12 text-xs font-bold text-text-secondary">
                          {appt.time.replace('AM', t('am')).replace('PM', t('pm'))}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {t('patient_no', { no: appt.patient.split('#')[1] })}
                          </p>
                          <p className="text-xs text-text-secondary">{t(appt.type as TranslationKey)}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t(appt.status as TranslationKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
