import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, DollarSign, Calendar, FileText, Send, CheckCircle, XCircle, MoreVertical, Eye } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { recruitmentService } from '../../services/recruitmentService';
import { recruitmentNotificationService } from '../../services/recruitmentNotificationService';
import { Offer, OfferStatus, Candidate, JobOpening } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

const Offers: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const canManageOffers = ['HR Manager', 'System Admin', 'Recruiter'].includes(user?.role || '');

  const [offers, setOffers] = useState<Offer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateDrawerOpen, setIsGenerateDrawerOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const { showToast } = useToast();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const dept = user?.role === 'Department Head' ? user?.department : undefined;
      const [offersRes, candidatesRes, openingsRes] = await Promise.all([
        recruitmentService.listOffers(dept),
        recruitmentService.listCandidates(undefined, dept),
        recruitmentService.listJobOpenings(dept)
      ]);
      
      if (offersRes.success && offersRes.data) setOffers(offersRes.data);
      if (candidatesRes.success && candidatesRes.data) setCandidates(candidatesRes.data);
      if (openingsRes.success && openingsRes.data) setOpenings(openingsRes.data);
    } catch (error) {
      showToast(t('recruitment_failed_load_offers'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return offers.filter(o => {
      const matchesSearch = 
        (o.candidateName && o.candidateName.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
        (o.openingTitle && o.openingTitle.toLowerCase().includes((searchQuery || '').toLowerCase()));
      return matchesSearch;
    });
  }, [offers, searchQuery]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageOffers) {
      showToast(t('recruitment_no_permission_generate_offer'), 'error');
      return;
    }

    const form = e.target as HTMLFormElement;
    const candidateId = (form.elements.namedItem('candidateId') as HTMLSelectElement).value;
    const openingId = (form.elements.namedItem('openingId') as HTMLSelectElement).value;
    const proposedStartDate = (form.elements.namedItem('proposedStartDate') as HTMLInputElement).value;
    const contractType = (form.elements.namedItem('contractType') as HTMLSelectElement).value;
    const baseSalary = parseFloat((form.elements.namedItem('baseSalary') as HTMLInputElement).value || '0');
    const allowances = parseFloat((form.elements.namedItem('allowances') as HTMLInputElement).value || '0');
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

    const candidate = candidates.find(c => c.id === candidateId);
    const opening = openings.find(o => o.id === openingId);

    if (!candidate || !opening) {
      showToast(t('recruitment_invalid_selection'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await recruitmentService.generateOffer({
        candidateId,
        candidateName: candidate.name,
        openingId,
        openingTitle: opening.title,
        proposedStartDate,
        baseSalary,
        allowances,
        contractType,
        notes,
        status: 'Draft'
      });
      
      if (response.success && response.data) {
        await recruitmentNotificationService.notifyOfferGenerated(response.data, user?.id || 'unknown');
        await fetchData();
        showToast(t('recruitment_offer_generated'), 'success');
        setIsGenerateDrawerOpen(false);
      } else {
        showToast(response.message || t('recruitment_failed_generate_offer'), 'error');
      }
    } catch (error) {
      showToast(t('recruitment_failed_generate_offer'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action: string, offer: Offer) => {
    if (!canManageOffers) {
      showToast(t('recruitment_no_permission_action'), 'error');
      return;
    }

    if (action === 'decline') {
      setSelectedOffer(offer);
      setIsDeclineModalOpen(true);
      return;
    }

    let newStatus: OfferStatus = offer.status;
    let message = '';

    switch (action) {
      case 'approve':
        newStatus = 'Pending Approval'; // Or 'Sent' depending on workflow
        message = t('recruitment_offer_approved');
        break;
      case 'send':
        newStatus = 'Sent';
        message = t('recruitment_offer_sent');
        break;
      case 'accept':
        newStatus = 'Accepted';
        message = t('recruitment_offer_accepted');
        break;
    }

    setIsSubmitting(true);
    try {
      await recruitmentService.updateOfferStatus(offer.id, newStatus);
      
      // Trigger notifications based on action
      if (action === 'send') {
        const candidate = candidates.find(c => c.id === offer.candidateId);
        if (candidate) {
          await recruitmentNotificationService.notifyOfferSent(offer, candidate);
        }
      } else if (action === 'accept') {
        const candidate = candidates.find(c => c.id === offer.candidateId);
        if (candidate) {
          await recruitmentNotificationService.notifyCandidateHired(candidate, offer);
        }
      }

      await fetchData();
      showToast(message, 'success');
    } catch (error) {
      showToast(t('recruitment_failed_action'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineConfirm = async () => {
    if (!declineReason.trim()) {
      showToast(t('recruitment_provide_reason'), 'error');
      return;
    }
    if (!selectedOffer) return;

    setIsSubmitting(true);
    try {
      await recruitmentService.updateOfferStatus(selectedOffer.id, 'Declined');
      await fetchData();
      showToast(t('recruitment_offer_declined_success'), 'info');
      setIsDeclineModalOpen(false);
      setDeclineReason('');
    } catch (error) {
      showToast(t('recruitment_failed_action'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: t('recruitment_candidate'), accessor: (row: Offer) => row.candidateName },
    { header: t('recruitment_job_opening'), accessor: (row: Offer) => row.openingTitle },
    { header: t('recruitment_status'), accessor: (row: Offer) => <StatusBadge status={row.status} translationKey={`recruitment_${row.status.toLowerCase().replace(' ', '_')}`} /> },
    { header: t('recruitment_start_date'), accessor: (row: Offer) => row.proposedStartDate },
    { header: t('recruitment_salary'), accessor: (row: Offer) => `$${row.baseSalary.toLocaleString()}` },
    { header: t('recruitment_created_at'), accessor: (row: Offer) => row.createdAt },
    {
      header: t('recruitment_actions'),
      accessor: (row: Offer) => (
        <div className="flex items-center gap-2">
          {row.status === 'Draft' && (
            <button 
              onClick={() => handleAction('approve', row)}
              disabled={!canManageOffers || isSubmitting}
              className="p-1 hover:bg-emerald-50 rounded text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('recruitment_approve_offer')}
            >
              <CheckCircle size={16} />
            </button>
          )}
          {row.status === 'Pending Approval' && (
            <button 
              onClick={() => handleAction('approve', row)}
              disabled={!canManageOffers || isSubmitting}
              className="p-1 hover:bg-emerald-50 rounded text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('recruitment_approve_offer')}
            >
              <CheckCircle size={16} />
            </button>
          )}
          {row.status === 'Sent' && (
            <div className="flex gap-1">
              <button 
                onClick={() => handleAction('accept', row)}
                disabled={!canManageOffers || isSubmitting}
                className="p-1 hover:bg-emerald-50 rounded text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('recruitment_mark_accepted')}
              >
                <CheckCircle size={16} />
              </button>
              <button 
                onClick={() => handleAction('decline', row)}
                disabled={!canManageOffers || isSubmitting}
                className="p-1 hover:bg-rose-50 rounded text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('recruitment_mark_declined')}
              >
                <XCircle size={16} />
              </button>
            </div>
          )}
          <button 
            onClick={() => { setSelectedOffer(row); setIsDetailsOpen(true); }}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors"
            title={t('view')}
          >
            <Eye size={16} />
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
          onClick={() => setIsGenerateDrawerOpen(true)}
          disabled={!canManageOffers}
          className="btn-gradient-primary rounded-lg flex items-center gap-2 shadow-sm px-4 py-2 ms-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          {t('recruitment_generate_offer')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={filteredData} isLoading={isLoading} />
      </div>

      {/* Generate Drawer */}
      <Drawer
        isOpen={isGenerateDrawerOpen}
        onClose={() => setIsGenerateDrawerOpen(false)}
        title={t('recruitment_generate_offer')}
      >
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_candidate')} *</label>
              <select name="candidateId" required className="w-full px-4 py-2 rounded-lg border border-slate-200">
                {candidates.filter(c => c.stage === 'Offer' || c.stage === 'Interview').map(c => (
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
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_start_date')} *</label>
                <input type="date" name="proposedStartDate" required className="w-full px-4 py-2 rounded-lg border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_contract_type')} *</label>
                <select name="contractType" className="w-full px-4 py-2 rounded-lg border border-slate-200">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_salary')} *</label>
                <div className="relative">
                  <DollarSign className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="number" name="baseSalary" required className="w-full ps-10 pe-4 py-2 rounded-lg border border-slate-200" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_allowances')}</label>
                <div className="relative">
                  <DollarSign className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="number" name="allowances" className="w-full ps-10 pe-4 py-2 rounded-lg border border-slate-200" placeholder="0.00" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('recruitment_notes')}</label>
              <textarea name="notes" rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Relocation package, bonus structure, etc..."></textarea>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsGenerateDrawerOpen(false)} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('recruitment_save')}
            </button>
          </div>
        </form>
      </Drawer>

      {/* Decline Modal */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={t('recruitment_offer_details')}
        size="lg"
      >
        {selectedOffer && (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-brand-primary-start/10 rounded-xl border border-brand-primary-start/20">
              <div>
                <h3 className="text-lg font-bold text-brand-primary-end">{selectedOffer.candidateName}</h3>
                <p className="text-sm text-brand-primary-end/80">{selectedOffer.openingTitle}</p>
              </div>
              <StatusBadge status={selectedOffer.status} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{t('recruitment_proposed_start_date')}</p>
                <p className="text-sm font-semibold text-text-primary">{selectedOffer.proposedStartDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{t('recruitment_contract_type')}</p>
                <p className="text-sm font-semibold text-text-primary">{selectedOffer.contractType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{t('recruitment_base_salary')}</p>
                <p className="text-sm font-semibold text-text-primary">${selectedOffer.baseSalary.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{t('recruitment_allowances')}</p>
                <p className="text-sm font-semibold text-text-primary">${selectedOffer.allowances.toLocaleString()}</p>
              </div>
            </div>

            {selectedOffer.notes && (
              <div className="space-y-2">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{t('recruitment_notes')}</p>
                <div className="p-4 bg-bg-main rounded-lg border border-border-base text-sm text-text-primary italic">
                  "{selectedOffer.notes}"
                </div>
              </div>
            )}

            {selectedOffer.declineReason && (
              <div className="space-y-2">
                <p className="text-xs text-rose-600 font-medium uppercase tracking-wider">{t('recruitment_decline_reason')}</p>
                <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 text-sm text-rose-700 italic">
                  "{selectedOffer.declineReason}"
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-border-base flex gap-3">
              {selectedOffer.status === 'Draft' && (
                <button 
                  onClick={() => { handleAction('approve', selectedOffer); setIsDetailsOpen(false); }}
                  className="flex-1 btn-gradient-primary py-2.5 rounded-lg font-semibold shadow-lg shadow-brand-primary-start/20"
                >
                  {t('recruitment_approve_offer')}
                </button>
              )}
              {selectedOffer.status === 'Approved' && (
                <button 
                  onClick={() => { handleAction('send', selectedOffer); setIsDetailsOpen(false); }}
                  className="flex-1 btn-gradient-primary py-2.5 rounded-lg font-semibold shadow-lg shadow-brand-primary-start/20"
                >
                  {t('recruitment_send_offer')}
                </button>
              )}
              {selectedOffer.status === 'Sent' && (
                <>
                  <button 
                    onClick={() => { handleAction('accept', selectedOffer); setIsDetailsOpen(false); }}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-all"
                  >
                    {t('recruitment_mark_accepted')}
                  </button>
                  <button 
                    onClick={() => { setIsDeclineModalOpen(true); setIsDetailsOpen(false); }}
                    className="flex-1 bg-rose-50 text-rose-600 border border-rose-100 py-2.5 rounded-lg font-semibold hover:bg-rose-100 transition-all"
                  >
                    {t('recruitment_mark_declined')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        title={t('recruitment_mark_declined')}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('recruitment_decline_reason_prompt')}</p>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
            rows={3}
            placeholder={t('recruitment_decline_reason_placeholder')}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          ></textarea>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsDeclineModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50">{t('recruitment_cancel')}</button>
            <button 
              onClick={handleDeclineConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {t('confirm')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Offers;
