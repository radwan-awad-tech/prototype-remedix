import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, FileText, Calendar, DollarSign, UserPlus, Trash2, ChevronRight, Eye, Edit } from 'lucide-react';
import { recruitmentService } from '../../services/recruitmentService';
import { recruitmentNotificationService } from '../../services/recruitmentNotificationService';
import { Candidate, CandidateStage, JobOpening } from '../../types';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';
import ConvertWizard from './ConvertWizard';

const STAGES: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'];

const CandidatePipeline: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const canManageCandidates = ['HR Manager', 'System Admin', 'Recruiter'].includes(user?.role || '');

  const stageLabels: Record<string, string> = {
    'Applied': t('recruitment_applied'),
    'Screening': t('recruitment_screening'),
    'Interview': t('recruitment_interview'),
    'Offer': t('recruitment_offer'),
    'Hired': t('recruitment_hired'),
    'Rejected': t('recruitment_rejected'),
    'Withdrawn': t('recruitment_withdrawn')
  };
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOpeningId, setSelectedOpeningId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [openMenuCandidateId, setOpenMenuCandidateId] = useState<string | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isConvertWizardOpen, setIsConvertWizardOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const dept = user?.role === 'Department Head' ? user?.department : undefined;
      const [candidatesRes, openingsRes] = await Promise.all([
        recruitmentService.listCandidates(undefined, dept),
        recruitmentService.listJobOpenings(dept)
      ]);
      
      if (candidatesRes.success) setCandidates(candidatesRes.data);
      if (openingsRes.success) {
        setOpenings(openingsRes.data);
        if (openingsRes.data.length > 0 && !selectedOpeningId) {
          setSelectedOpeningId(openingsRes.data[0].id);
        }
      }
    } catch (error) {
      showToast(t('recruitment_failed_load_pipeline'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesOpening = !selectedOpeningId || c.openingId === selectedOpeningId;
      const matchesSearch = (c.name && c.name.toLowerCase().includes((searchQuery || '').toLowerCase())) || 
                           (c.email && c.email.toLowerCase().includes((searchQuery || '').toLowerCase()));
      return matchesOpening && matchesSearch;
    });
  }, [candidates, selectedOpeningId, searchQuery]);

  const candidatesByStage = useMemo(() => {
    const grouped: Record<string, Candidate[]> = {};
    STAGES.forEach(stage => grouped[stage] = []);
    filteredCandidates.forEach(c => {
      if (grouped[c.stage]) grouped[c.stage].push(c);
    });
    return grouped;
  }, [filteredCandidates]);

  const handleMoveStage = async (candidate: Candidate, newStage: CandidateStage) => {
    if (!canManageCandidates) {
      showToast(t('recruitment_no_permission_move'), 'error');
      return;
    }
    if (newStage === 'Rejected') {
      setSelectedCandidate(candidate);
      setIsRejectModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await recruitmentService.updateCandidateStage(candidate.id, newStage);
      if (response.success) {
        await fetchData();
        
        if (newStage === 'Interview') {
          showToast(t('recruitment_candidate_moved_interview', { name: candidate.name }), 'info');
        } else if (newStage === 'Offer') {
          showToast(t('recruitment_candidate_moved_offer', { name: candidate.name }), 'info');
        } else if (newStage === 'Hired') {
          showToast(t('recruitment_candidate_hired_success', { name: candidate.name }), 'success');
        } else {
          showToast(t('recruitment_candidate_moved_to', { name: candidate.name, stage: stageLabels[newStage] || newStage }), 'success');
        }
        
        // Update selected candidate in drawer if it's open
        if (selectedCandidate && selectedCandidate.id === candidate.id) {
          setSelectedCandidate(prev => prev ? { ...prev, stage: newStage } : null);
        }
      } else {
        showToast(response.message || t('recruitment_failed_move'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_move'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageCandidates) {
      showToast(t('recruitment_no_permission_add'), 'error');
      return;
    }

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const openingId = (form.elements.namedItem('openingId') as HTMLSelectElement).value;
    const experienceYears = parseInt((form.elements.namedItem('experienceYears') as HTMLInputElement).value || '0', 10);
    const source = (form.elements.namedItem('source') as HTMLSelectElement).value;
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

    setIsSubmitting(true);
    try {
      const response = await recruitmentService.addCandidate({
        openingId,
        name,
        email,
        phone,
        experienceYears,
        education: 'Not specified', // Defaulting for now
        source: source as any,
        notes,
        cvUrl: 'https://example.com/cv.pdf' // Mock CV
      });
      if (response.success) {
        await recruitmentNotificationService.notifyCandidateAdded(response.data, user?.id || 'unknown');
        await fetchData();
        showToast(t('recruitment_candidate_added_success'), 'success');
        setIsAddDrawerOpen(false);
      } else {
        showToast(response.message || t('recruitment_failed_add'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_add'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      showToast(t('recruitment_provide_rejection_reason'), 'error');
      return;
    }
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    try {
      const response = await recruitmentService.updateCandidateStage(selectedCandidate.id, 'Rejected');
      if (response.success) {
        await recruitmentNotificationService.notifyCandidateRejected(selectedCandidate, user?.id || 'unknown', rejectionReason);
        await fetchData();
        showToast(t('recruitment_candidate_rejected_success'), 'info');
        setIsRejectModalOpen(false);
        setIsDetailsDrawerOpen(false);
        setRejectionReason('');
      } else {
        showToast(response.message || t('recruitment_failed_reject'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_reject'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="w-64">
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{t('recruitment_job_opening')}</label>
          <select 
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
            value={selectedOpeningId}
            onChange={(e) => setSelectedOpeningId(e.target.value)}
          >
            <option value="">{t('recruitment_all_departments')}</option>
            {openings.map(jo => (
              <option key={jo.id} value={jo.id}>{jo.title} ({jo.id})</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 min-w-[200px] self-end">
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
          onClick={() => setIsAddDrawerOpen(true)}
          disabled={!canManageCandidates}
          className="self-end btn-gradient-primary px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm ms-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          {t('recruitment_add_candidate')}
        </button>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-end"></div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[600px]">
          {STAGES.map(stage => (
            <div key={stage} className="flex-shrink-0 w-80 flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  {stageLabels[stage]}
                  <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                    {candidatesByStage[stage].length}
                  </span>
                </h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
              </div>
              
              <div className="flex-1 bg-slate-50/50 rounded-xl p-2 border border-dashed border-slate-200 space-y-3">
                {candidatesByStage[stage].map(candidate => (
                  <div 
                    key={candidate.id}
                    onClick={() => { setSelectedCandidate(candidate); setIsDetailsDrawerOpen(true); }}
                    className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-primary-start/40 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2 relative">
                      <h4 className="font-medium text-slate-900 group-hover:text-brand-primary-end transition-colors">{candidate.name}</h4>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuCandidateId(openMenuCandidateId === candidate.id ? null : candidate.id);
                          }}
                          className={`text-slate-300 hover:text-slate-500 p-1 rounded-full hover:bg-slate-100 transition-colors ${openMenuCandidateId === candidate.id ? 'bg-slate-100 text-slate-500' : ''}`}
                        >
                          <MoreVertical size={14} />
                        </button>
                        {openMenuCandidateId === candidate.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={(e) => { e.stopPropagation(); setOpenMenuCandidateId(null); }} 
                            />
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); setIsDetailsDrawerOpen(true); setOpenMenuCandidateId(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye size={12} /> {t('view_details')}
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); showToast('Candidate editing coming soon', 'info'); setOpenMenuCandidateId(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Edit size={12} /> {t('edit')}
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); setIsRejectModalOpen(true); setOpenMenuCandidateId(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 size={12} /> {t('reject')}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} /> {candidate.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={12} /> {candidate.phone}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{t('recruitment_applied')}: {candidate.appliedAt}</span>
                      <div className="flex gap-1">
                        {candidate.cvUrl && <FileText size={14} className="text-slate-400" />}
                      </div>
                    </div>
                  </div>
                ))}
                {candidatesByStage[stage].length === 0 && (
                  <div className="h-24 flex items-center justify-center text-slate-400 text-xs italic">
                    {t('recruitment_no_candidates')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Details Drawer */}
      <Drawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        footer={selectedCandidate && (
          <div className="flex flex-col gap-2 w-full">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleMoveStage(selectedCandidate, 'Interview')}
                disabled={isSubmitting || !canManageCandidates}
                className="px-4 py-2 btn-gradient-primary rounded-lg flex items-center justify-center gap-2 text-sm shadow-sm disabled:opacity-50"
              >
                <Calendar size={16} />
                {t('schedule_interview')}
              </button>
              <button 
                onClick={() => handleMoveStage(selectedCandidate, 'Offer')}
                disabled={isSubmitting || !canManageCandidates}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <DollarSign size={16} />
                {t('generate_offer')}
              </button>
            </div>
            {selectedCandidate.stage === 'Hired' && (
              <button 
                onClick={() => setIsConvertWizardOpen(true)}
                disabled={!canManageCandidates}
                className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <UserPlus size={16} />
                {t('convert_to_employee')}
              </button>
            )}
            <button 
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isSubmitting || !canManageCandidates}
              className="w-full px-4 py-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Trash2 size={16} />
              {t('recruitment_reject_candidate')}
            </button>
          </div>
        )}
      >
        {selectedCandidate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-primary-start/10 flex items-center justify-center text-brand-primary-end text-xl font-bold">
                {selectedCandidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
                <p className="text-sm text-slate-500">{selectedCandidate.email} • {selectedCandidate.phone}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedCandidate.stage} translationKey={`recruitment_${selectedCandidate.stage.toLowerCase()}`} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
              <div>
                <p className="text-slate-500">{t('experience')}</p>
                <p className="font-medium">{selectedCandidate.experienceYears} {t('years')}</p>
              </div>
              <div>
                <p className="text-slate-500">{t('education')}</p>
                <p className="font-medium">{selectedCandidate.education}</p>
              </div>
              <div>
                <p className="text-slate-500">{t('source')}</p>
                <p className="font-medium">{selectedCandidate.source}</p>
              </div>
              <div>
                <p className="text-slate-500">{t('applied_date')}</p>
                <p className="font-medium">{selectedCandidate.appliedAt}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">{t('notes')}</h4>
              <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200 italic">
                "{selectedCandidate.notes}"
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">{t('documents')}</h4>
              <div className="space-y-2">
                {selectedCandidate.attachments && selectedCandidate.attachments.length > 0 ? (
                  selectedCandidate.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{attachment.name}</p>
                          <p className="text-xs text-slate-500">{attachment.type} • {attachment.uploadedAt}</p>
                        </div>
                      </div>
                      <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-brand-primary-end hover:text-brand-primary-end/80 text-sm font-medium">{t('view')}</a>
                    </div>
                  ))
                ) : selectedCandidate.cvUrl ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{t('curriculum_vitae')}</p>
                        <p className="text-xs text-slate-500">{t('legacy_attachment')}</p>
                      </div>
                    </div>
                    <a href={selectedCandidate.cvUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary-end hover:text-brand-primary-end/80 text-sm font-medium">{t('view')}</a>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">{t('no_documents_attached')}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">{t('stage_history')}</h4>
              <div className="space-y-3">
                {selectedCandidate.history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-brand-primary-end mt-1.5"></div>
                      {i < selectedCandidate.history.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{h.stage}</p>
                      <p className="text-xs text-slate-500">{h.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Candidate Drawer */}
      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title={t('recruitment_new_candidate')}
        footer={
          <div className="flex gap-3 w-full">
            <button type="button" onClick={() => setIsAddDrawerOpen(false)} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button form="add-candidate-form" type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_add_candidate')}
            </button>
          </div>
        }
      >
        <form id="add-candidate-form" onSubmit={handleAddCandidate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('full_name')} *</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full px-4 py-2 rounded-lg border border-slate-200" 
                placeholder={t('full_name_placeholder')} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')} *</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200" 
                  placeholder={t('email_placeholder')} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('phone')} *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200" 
                  placeholder={t('phone_placeholder')} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('job_opening')} *</label>
              <select name="openingId" className="w-full px-4 py-2 rounded-lg border border-slate-200">
                <option value="">{t('select_job_opening')}</option>
                {openings.map(jo => (
                  <option key={jo.id} value={jo.id}>{jo.title} ({jo.id})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('experience_years')} ({t('years')})</label>
                <input 
                  type="number" 
                  name="experienceYears" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200" 
                  placeholder={t('experience_placeholder')} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('source')}</label>
                <select name="source" className="w-full px-4 py-2 rounded-lg border border-slate-200">
                  <option value="Referral">{t('referral')}</option>
                  <option value="Email">{t('email')}</option>
                  <option value="Agency">{t('agency')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('resume_cv')}</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-primary-end transition-colors cursor-pointer">
                <FileText className="mx-auto text-slate-400 mb-2" size={32} />
                <p className="text-sm text-slate-600">{t('upload_cv_hint')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('cv_format_hint')}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('notes')}</label>
              <textarea 
                name="notes" 
                rows={3} 
                className="w-full px-4 py-2 rounded-lg border border-slate-200" 
                placeholder={t('notes_placeholder')}
              ></textarea>
            </div>
          </div>
        </form>
      </Drawer>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={t('recruitment_reject_candidate')}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600" dangerouslySetInnerHTML={{ 
            __html: t('recruitment_rejection_reason_msg', { name: selectedCandidate?.name }) 
          }} />
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
            rows={3}
            placeholder={t('recruitment_rejection_reason_placeholder')}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          ></textarea>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsRejectModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button 
              onClick={handleRejectConfirm}
              disabled={isSubmitting || !rejectionReason.trim()}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_confirm_reject_btn')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Convert Wizard */}
      {selectedCandidate && (
        <ConvertWizard
          isOpen={isConvertWizardOpen}
          onClose={() => setIsConvertWizardOpen(false)}
          candidate={selectedCandidate}
        />
      )}
    </div>
  );
};

export default CandidatePipeline;
