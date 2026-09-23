import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../auth/AuthContext';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { ApprovalRequest } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { CheckCircle2, User as UserIcon } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

interface ApprovalsInboxProps {
  department?: string;
}

export const ApprovalsInbox: React.FC<ApprovalsInboxProps> = ({ department: filterDepartment }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApprovals = async () => {
      setIsLoading(true);
      try {
        const department = filterDepartment || (user?.role === 'Department Head' ? user.department : undefined);
        const response = await dashboardService.listApprovals(department);
        if (response.success) {
          setApprovals(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch approvals', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovals();
  }, [user, filterDepartment]);

  const filteredApprovals = approvals.filter(req => 
    (req.requesterName && req.requesterName.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (req.type && req.type.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (req.details && req.details.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  const columns = [
    { header: 'Requester', accessor: 'requesterName' as const, className: 'font-medium', translationKey: 'requester' as const },
    { header: 'Type', accessor: 'type' as const, translationKey: 'type' as const },
    { header: 'Details', accessor: 'details' as const, translationKey: 'details' as const },
    { header: 'Stage', accessor: 'stage' as const, translationKey: 'stage' as const },
    { 
      header: 'Status', 
      accessor: (row: ApprovalRequest) => <StatusBadge status={row.status} />,
      translationKey: 'status' as const
    },
  ];

  const [internalComments, setInternalComments] = useState('');

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRequest) return;
    try {
      const response = await dashboardService.approveRequest(selectedRequest.id);
      if (response.success) {
        setApprovals(prev => prev.map(a => a.id === selectedRequest.id ? { ...a, status: 'Approved' } : a));
        setIsApproveModalOpen(false);
        setSelectedRequest(null);
        setInternalComments('');
      }
    } catch (error) {
      console.error('Failed to approve request', error);
    }
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedRequest) return;
    try {
      const response = await dashboardService.rejectRequest(selectedRequest.id, rejectReason);
      if (response.success) {
        setApprovals(prev => prev.map(a => a.id === selectedRequest.id ? { ...a, status: 'Rejected' } : a));
        setIsRejectModalOpen(false);
        setSelectedRequest(null);
        setRejectReason('');
        setInternalComments('');
      }
    } catch (error) {
      console.error('Failed to reject request', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DataTable 
        data={filteredApprovals} 
        columns={columns} 
        onRowClick={(row) => setSelectedRequest(row)}
        onSearch={setSearchTerm}
        searchTranslationKey="search_approvals_placeholder"
        isLoading={isLoading}
      />

      <Drawer
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={t('approval_review')}
        footer={
          <div className="flex gap-3">
            <button 
              onClick={handleReject}
              className="flex-1 px-4 py-2 border border-rose-200 text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition-colors"
            >
              {t('reject')}
            </button>
            <button 
              onClick={handleApprove}
              className="flex-1 btn-gradient-primary px-4 py-2 rounded-lg font-medium"
            >
              {t('approve')}
            </button>
          </div>
        }
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="p-4 bg-bg-main rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold tracking-widest mb-1">{t('requester')}</p>
                <p className="text-sm font-semibold text-text-primary">{selectedRequest.requesterName}</p>
              </div>
              <button 
                onClick={() => navigate('/employees')} // In real app, navigate to specific employee
                className="p-2 bg-white border border-border-base rounded-lg text-text-secondary hover:text-brand-primary-end transition-colors shadow-sm"
                title={t('view_profile')}
              >
                <UserIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-secondary font-medium mb-1">{t('request_type')}</p>
                <p className="text-sm text-text-primary font-medium">{selectedRequest.type}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-medium mb-1">{t('details')}</p>
                <p className="text-sm text-text-primary">{selectedRequest.details}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-medium mb-1">{t('submission_date')}</p>
                <p className="text-sm text-text-primary">{selectedRequest.date}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-medium mb-1">{t('current_stage')}</p>
                <StatusBadge status={selectedRequest.stage === 'Manager' ? 'Pending' : 'Approved'} />
                <span className="ml-2 text-xs text-text-secondary rtl:mr-2 rtl:ml-0">({selectedRequest.stage})</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border-base">
              <label className="block text-xs font-medium text-text-secondary mb-2">{t('internal_comments')}</label>
              <textarea 
                value={internalComments}
                onChange={(e) => setInternalComments(e.target.value)}
                className="w-full p-3 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 min-h-[100px]"
                placeholder={t('comment_placeholder')}
              />
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={t('rejection_reason')}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">{t('rejection_reason_desc')}</p>
          <textarea 
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full p-3 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 min-h-[120px]"
            placeholder={t('reason_placeholder')}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-lg transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
              className="px-4 py-2 text-sm font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {t('confirm_reject')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title={t('approve_request')}
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsApproveModalOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={confirmApprove}
              className="flex-1 px-4 py-2 bg-brand-primary-end rounded-xl text-sm font-bold text-white hover:bg-brand-primary-start transition-colors"
            >
              {t('approve')}
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
            {t('approve_correction_confirm')
              .replace('{name}', selectedRequest?.requesterName || '')
              .replace('{date}', selectedRequest?.date || '')}
          </p>
        </div>
      </Modal>
    </div>
  );
};
