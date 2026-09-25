import React, { useState, useEffect } from 'react';
import { Plus, Check, X, MessageSquare, Paperclip, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceCorrection, RoleType } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../auth/AuthContext';

interface CorrectionRequestsProps {
  userRole: RoleType;
}

export const CorrectionRequests: React.FC<CorrectionRequestsProps> = ({ userRole }) => {
  const { user } = useAuth();
  const [corrections, setCorrections] = useState<AttendanceCorrection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedRequest, setSelectedRequest] = useState<AttendanceCorrection | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewRequestDrawerOpen, setIsNewRequestDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCorrections = async () => {
      try {
        const response = await attendanceService.listAttendanceCorrections(
          userRole === 'Department Head' ? user?.department : undefined
        );
        if (response.success) {
          let filteredData = response.data;
          
          // Role-based record-level visibility
          if (userRole === 'Employee') {
            filteredData = filteredData.filter(req => req.employeeId === user?.employeeId);
          }
          
          setCorrections(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch correction requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCorrections();
  }, [userRole, user]);

  const filteredData = corrections.filter(req => req.status === activeTab);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRequest) return;
    try {
      const response = await attendanceService.approveCorrection(selectedRequest.id);
      if (response.success) {
        setCorrections(prev => prev.map(c => c.id === selectedRequest.id ? { ...c, status: 'Approved' } : c));
        showToast('Correction request approved successfully.', 'success');
        setIsApproveModalOpen(false);
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error('Failed to approve correction', error);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason) {
      showToast('Please provide a reason for rejection.', 'error');
      return;
    }
    try {
      const response = await attendanceService.rejectCorrection(selectedRequest.id, rejectionReason);
      if (response.success) {
        setCorrections(prev => prev.map(c => c.id === selectedRequest.id ? { ...c, status: 'Rejected' } : c));
        showToast('Correction request rejected.', 'info');
        setIsRejectModalOpen(false);
        setIsDrawerOpen(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject correction', error);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const requestedIn = formData.get('requestedIn') as string;
    const requestedOut = formData.get('requestedOut') as string;
    const reason = formData.get('reason') as string;

    if (!date || !reason) {
      showToast('Date and reason are required', 'error');
      return;
    }

    const newRequest: AttendanceCorrection = {
      id: `COR-${Math.floor(Math.random() * 10000)}`,
      employeeId: user?.id || 'EMP-001',
      employeeName: user?.name || 'Current User',
      department: user?.department || 'General',
      date,
      requestedIn,
      requestedOut,
      reason,
      status: 'Pending',
      stage: 'Manager',
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await attendanceService.createAttendanceCorrection(newRequest);
      if (response.success) {
        setCorrections(prev => [newRequest, ...prev]);
        setIsNewRequestDrawerOpen(false);
        showToast('Correction request submitted successfully.', 'success');
      }
    } catch (error) {
      showToast('Failed to submit correction request.', 'error');
    }
  };

  const columns = [
    { header: t('date'), accessor: (row: AttendanceCorrection) => row.date },
    { header: t('employee'), accessor: (row: AttendanceCorrection) => row.employeeName },
    { header: t('requested_in'), accessor: (row: AttendanceCorrection) => row.requestedIn || '--:--' },
    { header: t('requested_out'), accessor: (row: AttendanceCorrection) => row.requestedOut || '--:--' },
    { header: t('reason'), accessor: (row: AttendanceCorrection) => (
      <span className="truncate max-w-xs block">{row.reason}</span>
    )},
    { header: t('submitted_at'), accessor: (row: AttendanceCorrection) => new Date(row.submittedAt).toLocaleDateString() },
    { header: t('status'), accessor: (row: AttendanceCorrection) => (
      <StatusBadge status={row.status} />
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {(['Pending', 'Approved', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab 
                ? 'bg-white text-brand-primary-end shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t(tab.toLowerCase() as any)}
            </button>
          ))}
        </div>
        {!!user?.employeeId && ['Senior Manager', 'HR Manager', 'HR Officer', 'Department Head', 'Employee'].includes(userRole) && <button
          onClick={() => setIsNewRequestDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 btn-gradient-primary rounded-lg shadow-sm text-sm font-medium"
        >
          <Plus size={18} />
          {t('new_request')}
        </button>}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(row) => {
          setSelectedRequest(row);
          setIsDrawerOpen(true);
        }}
        isLoading={isLoading}
      />

      <Drawer
        isOpen={isNewRequestDrawerOpen}
        onClose={() => setIsNewRequestDrawerOpen(false)}
        title={t('submit_correction_request')}
        footer={
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsNewRequestDrawerOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              form="correction-request-form"
              type="submit"
              className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm"
            >
              {t('submit_request')}
            </button>
          </div>
        }
      >
        <form id="correction-request-form" onSubmit={handleCreateRequest} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('date')} *</label>
              <input name="date" type="date" required className="w-full px-4 py-2 rounded-lg border border-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('requested_in')}</label>
                <input name="requestedIn" type="time" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('requested_out')}</label>
                <input name="requestedOut" type="time" className="w-full px-4 py-2 rounded-lg border border-gray-200" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('reason')} *</label>
              <textarea name="reason" required rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-200" placeholder={t('correction_reason_placeholder')}></textarea>
            </div>
          </div>
        </form>
      </Drawer>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={t('correction_request_details')}
        footer={selectedRequest && selectedRequest.status === 'Pending' && ['Senior Manager', 'HR Manager', 'Department Head'].includes(userRole) && (
          <div className="flex gap-3 w-full">
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all"
            >
              <Check size={18} />
              {t('approve')}
            </button>
            <button
              onClick={() => setIsRejectModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg font-medium hover:bg-rose-100 transition-all"
            >
              <X size={18} />
              {t('reject')}
            </button>
          </div>
        )}
      >
        {selectedRequest && (
          <div className="space-y-8">
            <div className="p-4 bg-brand-primary-start/10 rounded-xl border border-brand-primary-start/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-brand-primary-end">{selectedRequest.employeeName}</h4>
                  <p className="text-sm text-brand-primary-end/80">{t('request_for')} {selectedRequest.date}</p>
                </div>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-brand-primary-end font-medium">{t('requested_in')}</p>
                  <p className="text-brand-primary-end font-bold">{selectedRequest.requestedIn || '--:--'}</p>
                </div>
                <div>
                  <p className="text-brand-primary-end font-medium">{t('requested_out')}</p>
                  <p className="text-brand-primary-end font-bold">{selectedRequest.requestedOut || '--:--'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-400" />
                {t('reason_for_correction')}
              </h5>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 italic">
                "{selectedRequest.reason}"
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                <Paperclip size={18} className="text-gray-400" />
                {t('attachments')}
              </h5>
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <p className="text-sm text-gray-500">{t('no_attachments_provided')}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={t('reject_correction_request')}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{t('reject_correction_hint')}</p>
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 min-h-[120px]"
            placeholder={t('rejection_reason_placeholder')}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all font-medium"
            >
              {t('confirm_rejection')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title={t('approve_correction')}
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
            {t('approve_correction_confirm', { name: selectedRequest?.employeeName, date: selectedRequest?.date })}
          </p>
        </div>
      </Modal>
    </div>
  );
};
