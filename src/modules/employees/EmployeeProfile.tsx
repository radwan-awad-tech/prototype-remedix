import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Briefcase, Building2, Shield, FileText, 
  Clock, Award, Star, Edit, MoreVertical,
  Download, Trash2, CheckCircle2, AlertCircle,
  Stethoscope, Heart, Activity, ClipboardList,
  GraduationCap, Languages, Globe, Map
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Employee } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';

import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';

interface ProfileProps {
  employee: Employee;
  onClose: () => void;
}

export const EmployeeProfile: React.FC<ProfileProps> = ({ employee, onClose }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);

  const handleDownload = () => {
    const data = JSON.stringify(employee, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employee_${employee.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t('employee_data_exported'), 'success');
  };

  const handleEdit = () => {
    showToast(t('feature_coming_soon'), 'info');
  };

  const handleAction = (action: string) => {
    if (['Terminate', 'Update Status'].includes(action) && !['Senior Manager','HR Manager'].includes(user?.role || '')) return;
    if (action === 'Terminate') {
      setIsTerminateModalOpen(true);
      return;
    }
    showToast(t('feature_coming_soon'), 'info');
  };

  const confirmTerminate = () => {
    if (!['Senior Manager','HR Manager'].includes(user?.role || '')) return;
    showToast(t('feature_coming_soon'), 'info');
    setIsTerminateModalOpen(false);
    onClose();
  };

  const tabs = [
    { id: 'overview', label: t('overview'), icon: <Activity className="w-4 h-4" /> },
    { id: 'personal', label: t('personal_information'), icon: <User className="w-4 h-4" /> },
    { id: 'employment', label: t('work_information'), icon: <Briefcase className="w-4 h-4" /> },
    { id: 'documents', label: t('documents'), icon: <FileText className="w-4 h-4" /> },
    { id: 'performance', label: t('performance'), icon: <Award className="w-4 h-4" /> },
    { id: 'attendance', label: t('attendance'), icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-bg-main/30 scroll-smooth">
      {/* Header Section */}
      <div className="bg-white border-b border-border-base p-6 md:p-8 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar & Status */}
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-brand-primary-start to-brand-primary-end flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg shadow-brand-primary-start/20">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div className="absolute -bottom-2 -end-2">
              <StatusBadge status={employee.status} />
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                  {employee.firstName} {employee.lastName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="px-2.5 py-1 bg-bg-main text-text-secondary text-xs font-bold rounded-lg border border-border-base">
                    {employee.employeeNo}
                  </span>
                  <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{employee.department}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border-base" />
                  <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">{employee.position}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDownload}
                  className="p-2.5 text-text-secondary hover:bg-bg-main rounded-xl border border-border-base transition-all"
                  title={t('download')}
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleEdit}
                  className="p-2.5 text-text-secondary hover:bg-bg-main rounded-xl border border-border-base transition-all"
                  title={t('edit')}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <div className="relative group">
                  <button className="btn-gradient-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary-start/20">
                    {t('actions')}
                  </button>
                  <div className="absolute end-0 mt-2 w-48 bg-white border border-border-base rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                    <button 
                      onClick={() => handleAction('Request Leave')}
                      className="w-full text-start px-4 py-2 text-sm text-text-primary hover:bg-bg-main transition-colors"
                    >
                      {t('request_leave')}
                    </button>
                    <button 
                      onClick={() => handleAction('Update Status')}
                      hidden={!['Senior Manager','HR Manager'].includes(user?.role || '')}
                      className="w-full text-start px-4 py-2 text-sm text-text-primary hover:bg-bg-main transition-colors"
                    >
                      {t('update_status')}
                    </button>
                    <button 
                      onClick={() => handleAction('Terminate')}
                      hidden={!['Senior Manager','HR Manager'].includes(user?.role || '')}
                      className="w-full text-start px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      {t('terminate')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-bg-main rounded-2xl border border-border-base/50">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('hire_date')}</p>
                <p className="text-sm font-bold text-text-primary">{employee.hireDate}</p>
              </div>
              <div className="p-3 bg-bg-main rounded-2xl border border-border-base/50">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('role')}</p>
                <p className="text-sm font-bold text-text-primary">{employee.role}</p>
              </div>
              <div className="p-3 bg-bg-main rounded-2xl border border-border-base/50">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('email')}</p>
                <p className="text-sm font-bold text-text-primary truncate">{employee.email}</p>
              </div>
              <div className="p-3 bg-bg-main rounded-2xl border border-border-base/50">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('phone')}</p>
                <p className="text-sm font-bold text-text-primary">{employee.phone || t('not_available')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 md:px-8 bg-white border-b border-border-base sticky top-0 z-10">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab}
          variant="underline"
        />
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Key Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Summary Card */}
                <div className="bg-white rounded-3xl border border-border-base p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      {t('performance_summary')}
                    </h3>
                    <button 
                      onClick={() => showToast('Performance history is coming soon.', 'info')}
                      className="text-sm font-bold text-brand-primary-end hover:underline"
                    >
                      {t('view_all')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs text-text-secondary mb-1">{t('overall_rating')}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-text-primary">4.8</span>
                        <span className="text-sm text-text-secondary mb-1">/ 5.0</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs text-text-secondary mb-1">{t('last_review')}</p>
                      <p className="text-lg font-bold text-text-primary">Jan 2024</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs text-text-secondary mb-1">{t('next_review')}</p>
                      <p className="text-lg font-bold text-text-primary">July 2024</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl border border-border-base p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-primary-end" />
                    {t('recent_activity')}
                  </h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i < 3 && <div className="absolute start-5 top-10 bottom-0 w-0.5 bg-border-base" />}
                        <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center shrink-0 z-10">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="pb-6">
                          <p className="text-sm font-bold text-text-primary">{t('completed_annual_training')}</p>
                          <p className="text-xs text-text-secondary mt-1">March 15, 2024 • 09:30 AM</p>
                          <p className="text-xs text-text-secondary mt-2 bg-bg-main p-2 rounded-lg border border-border-base/50">
                            {t('compliance_training_desc')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Sidebar Info */}
              <div className="space-y-6">
                {/* Contact Details */}
                <div className="bg-white rounded-3xl border border-border-base p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">{t('contact_details')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase">{t('email')}</p>
                        <p className="text-sm font-medium text-text-primary">{employee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase">{t('phone')}</p>
                        <p className="text-sm font-medium text-text-primary">{employee.phone || t('not_available')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase">{t('address')}</p>
                        <p className="text-sm font-medium text-text-primary">{t('mock_address')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-3xl border border-border-base p-6 shadow-sm border-s-4 border-s-rose-500">
                  <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {t('emergency_contact')}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-text-primary">{t('mock_emergency_contact_name')}</p>
                    <p className="text-xs text-text-secondary">{t('mock_emergency_contact_relation')}</p>
                    <p className="text-sm font-medium text-brand-primary-end mt-2">+1 555-987-6543</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="bg-white rounded-3xl border border-border-base p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <section className="space-y-6">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest border-b border-border-base pb-2">{t('basic_details')}</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">{t('full_name')}</p>
                      <p className="text-sm font-bold text-text-primary">{employee.firstName} {employee.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">{t('date_of_birth')}</p>
                      <p className="text-sm font-bold text-text-primary">{t('mock_dob')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">{t('gender')}</p>
                      <p className="text-sm font-bold text-text-primary">{t('male')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">{t('nationality')}</p>
                      <p className="text-sm font-bold text-text-primary">{t('american')}</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest border-b border-border-base pb-2">{t('identification')}</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">{t('national_id_ssn')}</p>
                      <p className="text-sm font-bold text-text-primary">***-**-6789</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">{t('passport_number')}</p>
                      <p className="text-sm font-bold text-text-primary">A12345678</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">{t('passport_expiry')}</p>
                      <p className="text-sm font-bold text-text-primary">Jan 20, 2028</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest border-b border-border-base pb-2">{t('education')}</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-brand-primary-end" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{t('ms_nursing')}</p>
                        <p className="text-xs text-text-secondary">{t('university_healthcare')} • 2012</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-main flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-brand-primary-end" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{t('bs_nursing')}</p>
                        <p className="text-xs text-text-secondary">{t('state_medical_college')} • 2010</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Employment Tab */}
          {activeTab === 'employment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-border-base p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand-primary-start" />
                    {t('employment_details')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('employee_no')}</span>
                      <span className="text-sm font-bold text-text-primary">{employee.employeeNo}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('department')}</span>
                      <span className="text-sm font-bold text-text-primary">{employee.department}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('position')}</span>
                      <span className="text-sm font-bold text-text-primary">{employee.position}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('hire_date')}</span>
                      <span className="text-sm font-bold text-text-primary">{employee.hireDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('contract_type')}</span>
                      <span className="text-sm font-bold text-text-primary">{employee.contractType || t('full_time')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-text-secondary">{t('status')}</span>
                      <StatusBadge status={employee.status} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-border-base p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand-primary-start" />
                    {t('organization')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('supervisor')}</span>
                      <span className="text-sm font-bold text-text-primary">{t('mock_supervisor')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('category')}</span>
                      <span className="text-sm font-bold text-text-primary">{employee.category || t('medical_staff')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border-base/50">
                      <span className="text-sm text-text-secondary">{t('work_location')}</span>
                      <span className="text-sm font-bold text-text-primary">{t('main_hospital')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-text-secondary">{t('probation_end')}</span>
                      <span className="text-sm font-bold text-text-primary">2024-08-20</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-border-base p-6 shadow-sm text-center">
                <p className="text-sm text-text-secondary italic">
                  {t('additional_employment_info')}
                </p>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['documents', 'performance', 'attendance'].includes(activeTab) && (
            <div className="bg-white rounded-3xl border border-border-base p-12 shadow-sm text-center">
              <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary capitalize">{activeTab} {t('details')}</h3>
              <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
                {t('tab_loading_desc', { tab: activeTab })}
              </p>
              <button 
                onClick={() => showToast(t('feature_coming_soon'), 'info')}
                className="mt-6 px-6 py-2 bg-bg-main border border-border-base rounded-xl text-sm font-bold text-text-primary hover:bg-border-base transition-colors"
              >
                {t('refresh_data')}
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        title={t('terminate_employee')}
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsTerminateModalOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={confirmTerminate}
              className="flex-1 px-4 py-2 bg-rose-600 rounded-xl text-sm font-bold text-white hover:bg-rose-700 transition-colors"
            >
              {t('terminate')}
            </button>
          </div>
        }
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {t('are_you_sure')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('terminate_confirm_msg', { name: `${employee.firstName} ${employee.lastName}` })}
          </p>
        </div>
      </Modal>
    </div>
  );
};
