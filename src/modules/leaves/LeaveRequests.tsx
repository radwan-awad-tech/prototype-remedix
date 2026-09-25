import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { leaveService } from '../../services/leaveService';
import { LeaveRequest, RoleType, User } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Search, Filter, Plus, Download, FileText, ChevronRight } from 'lucide-react';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { LeaveRequestDetails } from './LeaveRequestDetails';
import { LeaveRequestForm } from './LeaveRequestForm';
import { useTranslation } from '../../hooks/useTranslation';

interface LeaveRequestsProps {
  currentRole: RoleType;
  currentUser: User;
}

export const LeaveRequests: React.FC<LeaveRequestsProps> = ({ currentRole, currentUser }) => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [activeRoleTab, setActiveRoleTab] = useState<'My' | 'Team' | 'All'>(
    currentRole === 'Department Head' ? 'Team' : ['Senior Manager', 'HR Manager', 'HR Officer', 'Payroll Officer'].includes(currentRole) ? 'All' : 'My'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await leaveService.listLeaveRequests(
          currentRole === 'Department Head' ? currentUser?.department : undefined
        );
        if (response.success) {
          setRequests(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch leave requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const isHR = ['Senior Manager', 'HR Manager', 'HR Officer'].includes(currentRole);
  const isDeptHead = currentRole === 'Department Head';
  const canCreateRequest = !!currentUser.employeeId && ['Senior Manager', 'HR Manager', 'HR Officer', 'Department Head', 'Employee'].includes(currentRole);

  const filteredData = useMemo(() => {
    return requests.filter(req => {
      // Role-based filtering
      if (activeRoleTab === 'My') {
        if (req.employeeId !== currentUser.employeeId) return false;
      } else if (activeRoleTab === 'Team') {
        // Team filtering (same department)
        if (req.department !== currentUser.department) return false; 
      }
      
      // Status filtering
      if (req.status !== activeStatusTab) return false;

      // Search filtering
      if (searchQuery) {
        const query = (searchQuery || '').toLowerCase();
        return (
          (req.employeeName && req.employeeName.toLowerCase().includes(query)) ||
          (req.employeeNo && req.employeeNo.toLowerCase().includes(query)) ||
          (req.leaveType && req.leaveType.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [requests, activeStatusTab, activeRoleTab, searchQuery, currentUser]);

  const columns = [
    { header: t('id'), accessor: 'id' as const, className: 'font-mono text-xs' },
    { header: t('employee'), accessor: 'employeeName' as const, className: 'font-semibold' },
    { header: t('department'), accessor: 'department' as const },
    { header: t('type'), accessor: 'leaveType' as const },
    { header: t('start_date'), accessor: 'startDate' as const },
    { header: t('end_date'), accessor: 'endDate' as const },
    { header: t('duration'), accessor: (row: LeaveRequest) => `${row.duration} ${t('days')}` },
    { 
      header: t('stage_status'), 
      accessor: (row: LeaveRequest) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={row.status} />
          <span className="text-[10px] text-text-secondary font-medium">{t('stage')}: {t(row.stage.toLowerCase() as any)}</span>
        </div>
      )
    },
    { header: t('submitted_at'), accessor: 'submittedAt' as const, className: 'text-text-secondary text-xs' },
  ];

  const handleRowClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await leaveService.updateLeaveStatus(id, 'Approved');
      if (response.success) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error('Failed to approve leave', error);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    try {
      const response = await leaveService.updateLeaveStatus(selectedRequest.id, 'Rejected', rejectReason);
      if (response.success) {
        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Rejected', rejectionReason: rejectReason } : r));
        setIsRejectModalOpen(false);
        setIsDetailsOpen(false);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Failed to reject leave', error);
    }
  };

  const canApprove = selectedRequest && ['Senior Manager', 'HR Manager', 'Department Head'].includes(currentRole) && selectedRequest.status === 'Pending' && selectedRequest.employeeId !== currentUser?.employeeId && selectedRequest.stage === (currentRole === 'Department Head' ? 'Manager' : 'HR');

  const tableHeaderActions = (
    <div className="flex items-center gap-3">
      {canCreateRequest && <button
        onClick={() => setIsFormOpen(true)}
        className="btn-gradient-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {t('new_leave_request')}
      </button>}
      {['Senior Manager', 'HR Manager'].includes(currentRole) && <button className="btn-secondary p-2">
        <Download className="w-4 h-4" />
      </button>}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Role Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-border-base rounded-xl w-fit shadow-sm">
        {currentUser.employeeId && <button
          onClick={() => setActiveRoleTab('My')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeRoleTab === 'My' ? 'bg-bg-main text-brand-primary-end' : 'text-text-secondary hover:text-text-primary'}`}
        >
          {t('my_requests')}
        </button>}
        {(isDeptHead || isHR) && currentUser.employeeId && (
          <button 
            onClick={() => setActiveRoleTab('Team')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeRoleTab === 'Team' ? 'bg-bg-main text-brand-primary-end' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {t('team_requests')}
          </button>
        )}
        {(isHR || currentRole === 'Payroll Officer') && (
          <button 
            onClick={() => setActiveRoleTab('All')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeRoleTab === 'All' ? 'bg-bg-main text-brand-primary-end' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {t('all_requests')}
          </button>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-8 border-b border-border-base px-2">
        {['Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatusTab(status as any)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeStatusTab === status ? 'text-brand-primary-end' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t(status.toLowerCase() as any)}
            {activeStatusTab === status && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-end rounded-full" />
            )}
          </button>
        ))}
      </div>

      <DataTable 
        data={filteredData} 
        columns={columns} 
        onRowClick={handleRowClick}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        searchPlaceholder={t('search_leave_placeholder')}
        headerActions={tableHeaderActions}
      />

      {/* Request Details Drawer */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={t('leave_request_details')}
        footer={canApprove && (
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsRejectModalOpen(true)}
              className="flex-1 px-6 py-2.5 border border-rose-200 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors"
            >
              {t('reject_request')}
            </button>
            <button 
              onClick={() => handleApprove(selectedRequest!.id)}
              className="flex-1 btn-gradient-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary-start/20"
            >
              {t('approve_request')}
            </button>
          </div>
        )}
      >
        {selectedRequest && (
          <LeaveRequestDetails 
            request={selectedRequest} 
            currentRole={currentRole}
            onApprove={handleApprove}
            onOpenReject={() => setIsRejectModalOpen(true)}
          />
        )}
      </Drawer>

      {/* New Request Drawer */}
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={t('new_leave_request')}
        footer={
          <div className="flex items-center justify-between w-full">
            <button 
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-6 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-xl transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              form="leave-request-form"
              type="submit"
              className="btn-gradient-primary px-8 py-2 rounded-xl text-sm font-medium shadow-lg shadow-brand-primary-start/20 flex items-center gap-2"
            >
              {t('submit_request')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        }
      >
        <LeaveRequestForm 
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (data) => {
            try {
              const response = await leaveService.createLeaveRequest({ ...data, employeeId: currentUser?.employeeId, employeeName: currentUser?.name, department: currentUser?.department });
              if (response.success) {
                setRequests(prev => [response.data, ...prev]);
                setIsFormOpen(false);
              }
            } catch (error) {
              console.error('Failed to create leave request', error);
            }
          }}
        />
      </Drawer>

      {/* Reject Modal */}
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
            className="w-full p-3 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none min-h-[120px]"
            placeholder={t('rejection_reason_placeholder')}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setIsRejectModalOpen(false)}
              className="px-6 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-xl transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="px-8 py-2 text-sm font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {t('confirm_reject')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
