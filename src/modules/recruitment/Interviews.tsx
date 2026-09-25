import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock, User, CheckCircle, XCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { recruitmentService } from '../../services/recruitmentService';
import { recruitmentNotificationService } from '../../services/recruitmentNotificationService';
import { Interview, InterviewOutcome, Candidate, JobOpening } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

const Interviews: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const canManageInterviews = ['Senior Manager', 'HR Manager', 'HR Officer'].includes(user?.role || '');

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [outcome, setOutcome] = useState<InterviewOutcome>('Pending');
  const [score, setScore] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const dept = user?.role === 'Department Head' ? user?.department : undefined;
      const [interviewsRes, candidatesRes, openingsRes] = await Promise.all([
        recruitmentService.listInterviews(dept),
        recruitmentService.listCandidates(undefined, dept),
        recruitmentService.listJobOpenings(dept)
      ]);
      
      if (interviewsRes.success) setInterviews(interviewsRes.data);
      if (candidatesRes.success) setCandidates(candidatesRes.data);
      if (openingsRes.success) setOpenings(openingsRes.data);
    } catch (error) {
      showToast(t('recruitment_failed_load_interviews'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return interviews.filter(i => {
      const matchesSearch = 
        (i.candidateName && i.candidateName.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
        (i.openingTitle && i.openingTitle.toLowerCase().includes((searchQuery || '').toLowerCase()));
      return matchesSearch;
    });
  }, [interviews, searchQuery]);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageInterviews) {
      showToast(t('recruitment_no_permission_schedule'), 'error');
      return;
    }

    const form = e.target as HTMLFormElement;
    const candidateId = (form.elements.namedItem('candidateId') as HTMLSelectElement).value;
    const openingId = (form.elements.namedItem('openingId') as HTMLSelectElement).value;
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const time = (form.elements.namedItem('time') as HTMLInputElement).value;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
    const interviewersStr = (form.elements.namedItem('interviewers') as HTMLInputElement).value;
    const location = (form.elements.namedItem('location') as HTMLInputElement).value;
    const formNotes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

    const candidate = candidates.find(c => c.id === candidateId);
    const opening = openings.find(o => o.id === openingId);

    if (!candidate || !opening) {
      showToast(t('recruitment_invalid_selection'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await recruitmentService.scheduleInterview({
        candidateId,
        candidateName: candidate.name,
        openingId,
        openingTitle: opening.title,
        dateTime: `${date}T${time}`,
        type: type as any,
        interviewers: interviewersStr.split(',').map(s => s.trim()).filter(Boolean),
        notes: formNotes,
        outcome: 'Pending'
      });
      if (response.success) {
        await recruitmentNotificationService.notifyInterviewScheduled(response.data, candidate);
        await fetchData();
        showToast(t('recruitment_interview_scheduled'), 'success');
        setIsScheduleDrawerOpen(false);
      } else {
        showToast(response.message || t('recruitment_failed_schedule'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_schedule'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordResult = async () => {
    if (!canManageInterviews) {
      showToast(t('recruitment_no_permission_record'), 'error');
      return;
    }
    if (outcome === 'Pending') {
      showToast(t('recruitment_select_outcome_error'), 'error');
      return;
    }
    if (!selectedInterview) return;

    setIsSubmitting(true);
    try {
      const response = await recruitmentService.recordInterviewOutcome(selectedInterview.id, outcome, score, notes);
      if (response.success) {
        await fetchData();
        showToast(`${t('recruitment_result_recorded')}: ${outcome ? t(`recruitment_${outcome.toLowerCase()}` as any) : ''}`, 'success');
        setIsRecordModalOpen(false);
        setOutcome('Pending');
        setScore(0);
        setNotes('');
      } else {
        showToast(response.message || t('recruitment_failed_record'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_record'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: t('recruitment_candidate'), accessor: (row: Interview) => row.candidateName },
    { header: t('recruitment_job_opening'), accessor: (row: Interview) => row.openingTitle },
    { header: t('recruitment_date_time'), accessor: (row: Interview) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{row.dateTime.split('T')[0]}</span>
        <span className="text-xs text-slate-500">{row.dateTime.split('T')[1]}</span>
      </div>
    )},
    { header: t('recruitment_interview_type'), accessor: (row: Interview) => row.type },
    { header: t('recruitment_interviewers'), accessor: (row: Interview) => (
      <div className="flex flex-wrap gap-1">
        {row.interviewers.map(i => (
          <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{i}</span>
        ))}
      </div>
    )},
    { header: t('recruitment_outcome'), accessor: (row: Interview) => <StatusBadge status={row.outcome} translationKey={`recruitment_${row.outcome?.toLowerCase()}`} /> },
    {
      header: t('recruitment_actions'),
      accessor: (row: Interview) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setSelectedInterview(row); setIsRecordModalOpen(true); }}
            disabled={!canManageInterviews}
            className="p-1 hover:bg-brand-primary-start/10 rounded text-brand-primary-end disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('recruitment_record_result')}
          >
            <CheckCircle size={16} />
          </button>
          <button 
            onClick={() => showToast(t('recruitment_interview_editing_soon'), 'info')}
            disabled={!canManageInterviews} 
            className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('edit')}
          >
            <Edit size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('recruitment_search_placeholder')}
            className="w-full ps-10 pe-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsScheduleDrawerOpen(true)}
          disabled={!canManageInterviews}
          className="btn-gradient-primary rounded-lg flex items-center gap-2 shadow-sm px-4 py-2 ms-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          {t('recruitment_schedule_interview')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading} 
          onRowClick={(row) => { setSelectedInterview(row); setIsRecordModalOpen(true); }}
          rowActions={(row) => [
            { 
              label: t('recruitment_record_outcome'), 
              onClick: () => { setSelectedInterview(row); setIsRecordModalOpen(true); },
              icon: <CheckCircle size={14} />
            },
            { 
              label: t('edit'), 
              onClick: () => showToast(t('recruitment_interview_editing_soon'), 'info'),
              icon: <Edit size={14} />
            },
            { 
              label: t('cancel'), 
              onClick: () => {
                setSelectedInterview(row);
                setIsCancelModalOpen(true);
              },
              icon: <XCircle size={14} />,
              variant: 'danger'
            }
          ]}
        />
      </div>

      {/* Schedule Drawer */}
      <Drawer
        isOpen={isScheduleDrawerOpen}
        onClose={() => setIsScheduleDrawerOpen(false)}
        title={t('recruitment_schedule_interview')}
      >
        <form onSubmit={handleSchedule} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_candidate')} *</label>
              <select name="candidateId" required className="w-full px-4 py-2 rounded-lg border border-slate-200">
                {candidates.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_job_opening')} *</label>
              <select name="openingId" required className="w-full px-4 py-2 rounded-lg border border-slate-200">
                {openings.map(jo => (
                  <option key={jo.id} value={jo.id}>{jo.title} ({jo.id})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_date')} *</label>
                <input type="date" name="date" required className="w-full px-4 py-2 rounded-lg border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_time')} *</label>
                <input type="time" name="time" required className="w-full px-4 py-2 rounded-lg border border-slate-200" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_interview_type')}</label>
              <select name="type" className="w-full px-4 py-2 rounded-lg border border-slate-200">
                <option value="Technical">{t('recruitment_technical')}</option>
                <option value="HR">{t('recruitment_hr')}</option>
                <option value="Panel">{t('recruitment_panel')}</option>
                <option value="Final">{t('recruitment_final')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_interviewers')}</label>
              <input type="text" name="interviewers" className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder={t('interviewers_placeholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_location_link')}</label>
              <input type="text" name="location" className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder={t('location_placeholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_notes')}</label>
              <textarea name="notes" rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder={t('notes_placeholder')}></textarea>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsScheduleDrawerOpen(false)} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_schedule')}
            </button>
          </div>
        </form>
      </Drawer>

      {/* Record Result Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={t('recruitment_record_result')}
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm font-medium text-slate-900">{selectedInterview?.candidateName}</p>
            <p className="text-xs text-slate-500">{selectedInterview?.openingTitle} • {selectedInterview?.type}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('recruitment_outcome')}</label>
              <div className="flex gap-4">
                {(['Pass', 'Fail', 'Pending'] as InterviewOutcome[]).map(o => (
                  <label key={o} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-brand-primary-end has-[:checked]:bg-brand-primary-start/10 has-[:checked]:text-brand-primary-end">
                    <input type="radio" name="outcome" value={o} className="hidden" onChange={() => setOutcome(o)} checked={outcome === o} />
                    <span className="text-sm font-medium">{t(`recruitment_${o.toLowerCase()}` as any)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_score')}</label>
              <input 
                type="number" 
                min="0" max="10" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200" 
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_notes')}</label>
              <textarea 
                rows={4} 
                className="w-full px-4 py-2 rounded-lg border border-slate-200" 
                placeholder={t('feedback_placeholder')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button onClick={() => setIsRecordModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button 
              onClick={handleRecordResult}
              disabled={isSubmitting}
              className="px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_save')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={t('recruitment_cancel_interview')}
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsCancelModalOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={async () => {
                if (!selectedInterview) return;
                try {
                  const response = await recruitmentService.recordInterviewOutcome(selectedInterview.id, 'Cancelled', 0, 'Interview cancelled by user');
                  if (response.success) {
                    await fetchData();
                    showToast(t('recruitment_interview_cancelled_success'), 'success');
                    setIsCancelModalOpen(false);
                  } else {
                    showToast(response.message || t('recruitment_failed_record'), 'error');
                  }
                } catch (error) {
                  showToast(t('recruitment_failed_record'), 'error');
                }
              }}
              className="flex-1 px-4 py-2 bg-rose-600 rounded-xl text-sm font-bold text-white hover:bg-rose-700 transition-colors"
            >
              {t('confirm')}
            </button>
          </div>
        }
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {t('are_you_sure')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('recruitment_cancel_confirmation_text', { name: selectedInterview?.candidateName })}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Interviews;
