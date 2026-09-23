import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Plus, Search, Filter, MoreVertical, Eye, Send, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { recruitmentService } from '../../services/recruitmentService';
import { recruitmentNotificationService } from '../../services/recruitmentNotificationService';
import { JobOpening, JobOpeningStatus } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';

interface JobOpeningsProps {
  onNavigateToPipeline: () => void;
}

const JobOpenings: React.FC<JobOpeningsProps> = ({ onNavigateToPipeline }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState<JobOpening | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { showToast } = useToast();

  const canApprove = user?.role === 'HR Manager' || user?.role === 'System Admin';
  const canManageOpenings = user?.role === 'HR Manager' || user?.role === 'System Admin' || user?.role === 'Department Manager';

  const fetchOpenings = async () => {
    setIsLoading(true);
    try {
      const response = await recruitmentService.listJobOpenings();
      if (response.success) {
        setOpenings(response.data);
      }
    } catch (error) {
      showToast(t('recruitment_failed_load_openings'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  const filteredData = useMemo(() => {
    return openings.filter(jo => {
      // Role-based filtering
      if (user?.role === 'Employee') {
        // Employees only see open jobs
        if (jo.status !== 'Open') return false;
      } else if (user?.role === 'Department Head' && user.department) {
        // Dept heads see jobs for their department OR open jobs
        if (jo.department !== user.department && jo.status !== 'Open') return false;
      }

      const matchesSearch = 
        (jo.title && jo.title.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
        (jo.id && jo.id.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
        (jo.department && jo.department.toLowerCase().includes((searchQuery || '').toLowerCase()));
      const matchesStatus = statusFilter === 'All' || jo.status === statusFilter;
      const matchesDept = deptFilter === 'All' || jo.department === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [openings, searchQuery, statusFilter, deptFilter, user]);

  const departments = useMemo(() => Array.from(new Set(openings.map(jo => jo.department))), [openings]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const response = await recruitmentService.createJobOpening({
        title: formData.get('title') as string,
        department: formData.get('department') as string,
        position: formData.get('position') as string,
        vacancies: parseInt(formData.get('vacancies') as string, 10),
        employmentType: formData.get('employmentType') as string,
        priority: formData.get('priority') as any,
        requirements: formData.get('requirements') as string,
        description: formData.get('description') as string,
      });
      if (response.success) {
        showToast(t('recruitment_opening_created_draft'), 'success');
        setIsCreateDrawerOpen(false);
        fetchOpenings();
      } else {
        showToast(response.message || t('recruitment_failed_add'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_add'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action: string, opening: JobOpening) => {
    if (action === 'pipeline') {
      onNavigateToPipeline();
      return;
    }

    if (action === 'reject') {
      setSelectedOpening(opening);
      setIsRejectModalOpen(true);
      return;
    }

    if (action === 'close') {
      setSelectedOpening(opening);
      setIsCloseModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (action === 'submit') {
        const response = await recruitmentService.updateJobOpeningStatus(opening.id, 'Pending Approval');
        if (response.success) {
          await recruitmentNotificationService.notifyOpeningSubmitted(opening, user?.id || 'unknown');
          showToast(t('recruitment_opening_submitted'), 'info');
        } else {
          showToast(response.message || t('recruitment_failed_action'), 'error');
        }
      } else if (action === 'approve') {
        if (!canApprove) {
          showToast(t('recruitment_no_permission_action'), 'error');
          return;
        }
        const response = await recruitmentService.updateJobOpeningStatus(opening.id, 'Open');
        if (response.success) {
          await recruitmentNotificationService.notifyOpeningApproved(opening, user?.id || 'unknown');
          showToast(t('recruitment_opening_approved'), 'success');
        } else {
          showToast(response.message || t('recruitment_failed_action'), 'error');
        }
      }
      setIsDetailsDrawerOpen(false);
      fetchOpenings();
    } catch (error) {
      showToast(t('recruitment_failed_action'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!reason) { showToast(t('recruitment_provide_reason'), 'error'); return; }
    if (!selectedOpening) return;
    
    setIsSubmitting(true);
    try {
      const response = await recruitmentService.updateJobOpeningStatus(selectedOpening.id, 'Draft', reason);
      if (response.success) {
        await recruitmentNotificationService.notifyOpeningRejected(selectedOpening, user?.id || 'unknown', reason);
        showToast(t('recruitment_opening_rejected'), 'info');
        setIsRejectModalOpen(false);
        setIsDetailsDrawerOpen(false);
        setReason('');
        fetchOpenings();
      } else {
        showToast(response.message || t('recruitment_failed_reject'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_reject'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirm = async () => {
    if (!reason) { showToast(t('recruitment_provide_reason'), 'error'); return; }
    if (!selectedOpening) return;
    
    setIsSubmitting(true);
    try {
      const response = await recruitmentService.updateJobOpeningStatus(selectedOpening.id, 'Closed', reason);
      if (response.success) {
        showToast(t('recruitment_opening_closed'), 'info');
        setIsCloseModalOpen(false);
        setIsDetailsDrawerOpen(false);
        setReason('');
        fetchOpenings();
      } else {
        showToast(response.message || t('recruitment_failed_action'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_action'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: t('id'), accessor: (row: JobOpening) => <span className="font-mono text-xs">{row.id}</span> },
    { header: t('recruitment_job_title'), accessor: (row: JobOpening) => row.title },
    { header: t('recruitment_department'), accessor: (row: JobOpening) => row.department },
    { header: t('recruitment_position'), accessor: (row: JobOpening) => row.position },
    { header: t('recruitment_vacancies'), accessor: (row: JobOpening) => row.vacancies },
    { header: t('recruitment_status'), accessor: (row: JobOpening) => <StatusBadge status={row.status} translationKey={`recruitment_${row.status.toLowerCase().replace(' ', '_')}`} /> },
    { header: t('recruitment_candidates'), accessor: (row: JobOpening) => row.candidateCount || 0 },
    { header: t('recruitment_created_at'), accessor: (row: JobOpening) => row.createdAt },
  ];

  const tableHeaderActions = (
    <div className="flex items-center gap-2">
      <select
        className="input-base"
        value={deptFilter}
        onChange={(e) => setDeptFilter(e.target.value)}
      >
        <option value="All">{t('recruitment_all_departments')}</option>
        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
      </select>

      <select
        className="input-base"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">{t('recruitment_all_statuses')}</option>
        <option value="Draft">{t('recruitment_draft')}</option>
        <option value="Pending Approval">{t('recruitment_pending_approval')}</option>
        <option value="Open">{t('recruitment_open')}</option>
        <option value="Closed">{t('recruitment_closed')}</option>
      </select>

      <button 
        onClick={() => setIsCreateDrawerOpen(true)}
        disabled={!canManageOpenings}
        className="btn-gradient-primary px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={18} />
        {t('recruitment_create_opening')}
      </button>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {/* Table */}
        <DataTable 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading} 
          onSearch={setSearchQuery}
          searchValue={searchQuery}
          searchTranslationKey="recruitment_search_placeholder"
          headerActions={tableHeaderActions}
          onRowClick={(row) => { setSelectedOpening(row); setIsDetailsDrawerOpen(true); }}
          rowActions={(row) => [
            { 
              label: t('recruitment_view_details'), 
              onClick: () => { setSelectedOpening(row); setIsDetailsDrawerOpen(true); },
              icon: <Eye size={14} />
            },
            { 
              label: t('recruitment_candidate_pipeline'), 
              onClick: () => handleAction('pipeline', row),
              icon: <ExternalLink size={14} />
            },
            { 
              label: t('recruitment_close_opening'), 
              onClick: () => handleAction('close', row),
              icon: <XCircle size={14} />,
              variant: 'danger'
            }
          ]}
        />
      </div>

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        title={t('recruitment_new_job_opening')}
        footer={
          <div className="flex gap-3 w-full">
            <button type="button" onClick={() => setIsCreateDrawerOpen(false)} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button form="create-opening-form" type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_generate_draft')}
            </button>
          </div>
        }
      >
        <form id="create-opening-form" onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_job_title')} *</label>
              <input name="title" type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="e.g. Senior Registered Nurse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_department')} *</label>
                <select name="department" required className="w-full px-4 py-2 rounded-lg border border-slate-200">
                  <option value="">{t('select_department')}</option>
                  <option value="Nursing">{t('nursing')}</option>
                  <option value="Emergency">{t('emergency')}</option>
                  <option value="Cardiology">{t('cardiology')}</option>
                  <option value="Laboratory">{t('laboratory')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_position_type')} *</label>
                <select name="position" required className="w-full px-4 py-2 rounded-lg border border-slate-200">
                  <option value="">{t('select_position')}</option>
                  <option value="Nurse">{t('nurse')}</option>
                  <option value="Doctor">{t('doctor')}</option>
                  <option value="Technician">{t('technician')}</option>
                  <option value="Administration">{t('administration')}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_vacancies')} *</label>
                <input name="vacancies" type="number" min="1" required className="w-full px-4 py-2 rounded-lg border border-slate-200" defaultValue="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_contract_type')} *</label>
                <select name="employmentType" required className="w-full px-4 py-2 rounded-lg border border-slate-200">
                  <option value="">{t('select_type')}</option>
                  <option value="Full-time">{t('recruitment_full_time')}</option>
                  <option value="Part-time">{t('recruitment_part_time')}</option>
                  <option value="Contract">{t('recruitment_contract')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_priority')} *</label>
              <div className="flex gap-4">
                {['Low', 'Medium', 'High'].map(p => (
                  <label key={p} className="flex items-center gap-2">
                    <input type="radio" name="priority" value={p} defaultChecked={p === 'Medium'} />
                    <span className="text-sm">{p ? t(`recruitment_priority_${p.toLowerCase()}` as any) : ''}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_requirements')} *</label>
              <textarea name="requirements" required rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder={t('recruitment_requirements_placeholder')}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_job_description')} *</label>
              <textarea name="description" required rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder={t('recruitment_job_description_placeholder')}></textarea>
            </div>
          </div>
        </form>
      </Drawer>

      {/* Details Drawer */}
      <Drawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        title={`${t('recruitment_job_details')}: ${selectedOpening?.id}`}
        footer={selectedOpening && (
          <div className="flex flex-col gap-2 w-full">
            {selectedOpening.status === 'Draft' && (
              <button 
                onClick={() => handleAction('submit', selectedOpening)}
                className="w-full px-4 py-2 btn-gradient-primary rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                <Send size={18} />
                {t('recruitment_submit_approval')}
              </button>
            )}
            {selectedOpening.status === 'Pending Approval' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction('approve', selectedOpening)}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {t('recruitment_approve')}
                </button>
                <button 
                  onClick={() => handleAction('reject', selectedOpening)}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  {t('recruitment_reject')}
                </button>
              </div>
            )}
            {selectedOpening.status === 'Open' && (
              <button 
                onClick={() => handleAction('close', selectedOpening)}
                className="w-full px-4 py-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                {t('recruitment_close_opening')}
              </button>
            )}
            <button 
              onClick={() => handleAction('pipeline', selectedOpening)}
              className="w-full px-4 py-2 border border-brand-primary-start/20 text-brand-primary-end rounded-lg hover:bg-brand-primary-start/10 flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              {t('recruitment_view_pipeline')}
            </button>
          </div>
        )}
      >
        {selectedOpening && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedOpening.title}</h3>
                  <p className="text-sm text-slate-500">{selectedOpening.department} • {selectedOpening.position}</p>
                </div>
                <StatusBadge status={selectedOpening.status} translationKey={`recruitment_${selectedOpening.status.toLowerCase().replace(' ', '_')}`} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">{t('recruitment_vacancies')}</p>
                  <p className="font-medium">{selectedOpening.vacancies}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t('recruitment_priority')}</p>
                  <p className="font-medium">{selectedOpening.priority ? t(`recruitment_priority_${selectedOpening.priority.toLowerCase()}` as any) : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t('recruitment_contract_type')}</p>
                  <p className="font-medium">{selectedOpening.employmentType}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t('recruitment_created_at')}</p>
                  <p className="font-medium">{selectedOpening.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{t('recruitment_requirements')}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedOpening.requirements}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{t('recruitment_job_description')}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedOpening.description}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={t('recruitment_reject_job_opening')}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('recruitment_reject_opening_msg')}</p>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-primary-start/20"
            rows={3}
            placeholder={t('recruitment_reason_rejection_placeholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsRejectModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button 
              onClick={handleRejectConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_confirm_reject')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Close Modal */}
      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        title={t('recruitment_close_job_opening')}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('recruitment_close_opening_msg')}</p>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-primary-start/20"
            rows={3}
            placeholder={t('recruitment_reason_closing_placeholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsCloseModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button 
              onClick={handleCloseConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_confirm_close')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobOpenings;
