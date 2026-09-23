import React, { useState, useEffect } from 'react';
import { Search, Star, Send, Save, FileText, ChevronRight, User, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { performanceService } from '../../services/performanceService';
import { EvaluationRecord, ReviewStatus, DataTableColumn } from '../../types';
import { TranslationKey } from '../../i18n/translations';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../auth/AuthContext';

export const EvaluationRecords: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<EvaluationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<EvaluationRecord | null>(null);
  const [activeTab, setActiveTab] = useState('My Pending Reviews');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const response = await performanceService.listReviews(undefined, dept);
        if (response.success) {
          let filteredReviews = response.data;
          
          if (user?.role === 'Employee') {
            filteredReviews = filteredReviews.filter(r => r.employeeId === user.id);
          }
          
          setReviews(filteredReviews);
        }
      } catch (error) {
        showToast(t('performance_failed_load_reviews'), 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [user]);

  const pendingReviews = reviews.filter(r => r.status !== 'Finalized');
  const receivedReviews = reviews.filter(r => r.status === 'Finalized');

  const columns: DataTableColumn<EvaluationRecord>[] = [
    { 
      header: 'Employee', 
      translationKey: 'performance_employee',
      accessor: (row: EvaluationRecord) => (
        <div className="flex items-center gap-3 text-start">
          <div className="w-8 h-8 bg-brand-primary-start/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-brand-primary-end" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{row.employeeName}</span>
            <span className="text-xs text-gray-500">{row.cycleName}</span>
          </div>
        </div>
      )
    },
    { header: 'Evaluator', translationKey: 'performance_evaluator', accessor: (row: EvaluationRecord) => row.evaluatorName },
    { 
      header: 'Status', 
      translationKey: 'status',
      accessor: (row: EvaluationRecord) => (
        <StatusBadge status={row.status} />
      )
    },
    { 
      header: 'Overall Score', 
      translationKey: 'performance_overall_score',
      accessor: (row: EvaluationRecord) => (
        <div className="flex items-center gap-1">
          <Star className={`w-4 h-4 ${row.overallScore ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          <span className="font-medium">{row.overallScore || '-'}</span>
        </div>
      )
    },
    { 
      header: 'Actions', 
      translationKey: 'actions',
      accessor: (row: EvaluationRecord) => (
        <button 
          onClick={() => { setSelectedReview(row); setIsDrawerOpen(true); }}
          className="flex items-center gap-1 text-brand-primary-end hover:opacity-80 font-medium text-sm"
        >
          {row.status === 'Finalized' ? t('performance_review_details') : t('performance_complete_review')}
          <ChevronRight className="w-4 h-4" />
        </button>
      )
    },
  ];

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [pendingReviewData, setPendingReviewData] = useState<Partial<EvaluationRecord> | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedReview) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedData: Partial<EvaluationRecord> = {
      ratings: {
        technical: Number(formData.get('technical')),
        communication: Number(formData.get('communication')),
        teamwork: Number(formData.get('teamwork')),
        discipline: Number(formData.get('discipline')),
      },
      comments: {
        technical: formData.get('tech_comment') as string,
        communication: formData.get('comm_comment') as string,
        teamwork: formData.get('team_comment') as string,
        discipline: formData.get('disc_comment') as string,
      },
      overallScore: (Number(formData.get('technical')) + Number(formData.get('communication')) + Number(formData.get('teamwork')) + Number(formData.get('discipline'))) / 4,
      managerComments: formData.get('managerComments') as string,
      developmentPlan: formData.get('developmentPlan') as string,
    };

    setPendingReviewData(updatedData);
    setIsSubmitModalOpen(true);
  };

  const confirmSubmit = async () => {
    if (!selectedReview || !pendingReviewData) return;
    
    try {
      const submitRes = await performanceService.submitReview(selectedReview.id, pendingReviewData);
      if (submitRes.success) {
        const listRes = await performanceService.listReviews();
        if (listRes.success) {
          setReviews(listRes.data);
        }
        setIsSubmitModalOpen(false);
        setIsDrawerOpen(false);
        showToast(t('performance_review_submitted'), 'success');
      } else {
        showToast(submitRes.message || t('performance_failed_submit_review'), 'error');
      }
    } catch (error) {
      showToast(t('performance_failed_submit_review'), 'error');
    }
  };

  const handleSaveDraft = () => {
    showToast(t('performance_draft_saved'), 'success');
    setIsDrawerOpen(false);
  };

  const RatingField = ({ label, labelKey, name, defaultValue, commentName, defaultComment }: { label: string, labelKey: any, name: string, defaultValue?: number, commentName: string, defaultComment?: string }) => (
    <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-900">{t(labelKey)} *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(val => (
            <label key={val} className="cursor-pointer">
              <input 
                type="radio" 
                name={name} 
                value={val} 
                defaultChecked={defaultValue === val}
                required
                className="peer sr-only"
                disabled={selectedReview?.status === 'Finalized'}
              />
              <div className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-sm font-medium transition-all peer-checked:bg-brand-primary-end peer-checked:text-white peer-checked:border-brand-primary-end hover:border-brand-primary-start">
                {val}
              </div>
            </label>
          ))}
        </div>
      </div>
      <textarea 
        name={commentName}
        defaultValue={defaultComment}
        placeholder={t('performance_rating_placeholder', { label: labelKey ? t(labelKey).toLowerCase() : '' })}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start"
        rows={2}
        disabled={selectedReview?.status === 'Finalized'}
      />
    </div>
  );

  const tabs: { id: string; label: string; translationKey: TranslationKey }[] = [
    { id: 'My Pending Reviews', label: 'My Pending Reviews', translationKey: 'performance_my_pending_reviews' as const },
    { id: 'My Received Reviews', label: 'My Received Reviews', translationKey: 'performance_my_received_reviews' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('performance_reviews_title')}</h2>
          <p className="text-sm text-gray-500">{t('performance_reviews_subtitle')}</p>
        </div>
      </div>

      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable 
          data={activeTab === 'My Pending Reviews' ? pendingReviews : receivedReviews} 
          columns={columns} 
          isLoading={isLoading}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedReview?.status === 'Finalized' ? t('performance_review_details') : t('performance_complete_review')}
        size="lg"
        footer={selectedReview && selectedReview.status !== 'Finalized' && (
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t('performance_save_draft')}
            </button>
            <button
              form="evaluation-form"
              type="submit"
              className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {t('performance_submit_review')}
            </button>
          </div>
        )}
      >
        {selectedReview && (
          <form id="evaluation-form" onSubmit={handleReviewSubmit} className="space-y-8">
            <div className="flex items-center gap-4 p-4 bg-brand-primary-start/10 rounded-xl border border-brand-primary-start/20">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-brand-primary-start/30 shadow-sm">
                <User className="w-6 h-6 text-brand-primary-end" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedReview.employeeName}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  {selectedReview.cycleName}
                </p>
              </div>
              <div className="ms-auto flex flex-col items-end">
                <StatusBadge status={selectedReview.status} />
                <span className="text-[10px] text-gray-400 mt-1">{t('performance_evaluator')}: {selectedReview.evaluatorName}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('performance_competency_ratings')}</h4>
              <RatingField 
                label="Technical Skills" 
                labelKey="performance_technical_skills"
                name="technical" 
                defaultValue={selectedReview.ratings.technical}
                commentName="tech_comment"
                defaultComment={selectedReview.comments.technical}
              />
              <RatingField 
                label="Communication" 
                labelKey="performance_communication"
                name="communication" 
                defaultValue={selectedReview.ratings.communication}
                commentName="comm_comment"
                defaultComment={selectedReview.comments.communication}
              />
              <RatingField 
                label="Teamwork" 
                labelKey="performance_teamwork"
                name="teamwork" 
                defaultValue={selectedReview.ratings.teamwork}
                commentName="team_comment"
                defaultComment={selectedReview.comments.teamwork}
              />
              <RatingField 
                label="Discipline" 
                labelKey="performance_discipline"
                name="discipline" 
                defaultValue={selectedReview.ratings.discipline}
                commentName="disc_comment"
                defaultComment={selectedReview.comments.discipline}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('performance_final_assessment')}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_manager_comments')} *</label>
                <textarea 
                  name="managerComments"
                  required
                  defaultValue={selectedReview.managerComments}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start"
                  rows={3}
                  disabled={selectedReview.status === 'Finalized'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_development_plan')}</label>
                <textarea 
                  name="developmentPlan"
                  defaultValue={selectedReview.developmentPlan}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start"
                  rows={3}
                  disabled={selectedReview.status === 'Finalized'}
                />
              </div>
            </div>
          </form>
        )}
      </Drawer>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={t('performance_submit_review')}
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsSubmitModalOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={confirmSubmit}
              className="flex-1 px-4 py-2 bg-brand-primary-end rounded-xl text-sm font-bold text-white hover:bg-brand-primary-start transition-colors"
            >
              {t('submit')}
            </button>
          </div>
        }
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-brand-primary-start/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-brand-primary-end" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {t('are_you_sure')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('performance_submit_confirmation_text')}
          </p>
        </div>
      </Modal>
    </div>
  );
};
