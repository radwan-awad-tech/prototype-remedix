import React, { useState } from 'react';
import { LeaveRequest, RoleType } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Calendar, Clock, User, FileText, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { useTranslation } from '../../hooks/useTranslation';

interface LeaveRequestDetailsProps {
  request: LeaveRequest;
  currentRole: RoleType;
  onApprove: (id: string) => void;
  onOpenReject: () => void;
}

export const LeaveRequestDetails: React.FC<LeaveRequestDetailsProps> = ({ request, currentRole, onApprove, onOpenReject }) => {
  const { t } = useTranslation();
  const canApprove = (currentRole === 'HR Manager' || currentRole === 'HR Officer' || currentRole === 'Department Head') && request.status === 'Pending';
  
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
        request.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
        request.status === 'Rejected' ? 'bg-rose-50 border-rose-100 text-rose-800' :
        'bg-amber-50 border-amber-100 text-amber-800'
      }`}>
        {request.status === 'Approved' ? <CheckCircle className="w-6 h-6" /> :
         request.status === 'Rejected' ? <XCircle className="w-6 h-6" /> :
         <Clock className="w-6 h-6" />}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider">{t('status')}: {t(request.status.toLowerCase() as any)}</p>
          <p className="text-xs opacity-80">{t('currently_at')} {t(request.stage.toLowerCase() as any)} {t('stage')}</p>
        </div>
      </div>

      {request.status === 'Approved' && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 text-blue-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium">{t('scheduling_block_hint')}</p>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-bg-main rounded-2xl">
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-1">{t('employee')}</p>
          <p className="text-sm font-bold text-text-primary">{request.employeeName}</p>
          <p className="text-[10px] text-text-secondary">{request.employeeNo} • {request.department}</p>
        </div>
        <div className="p-4 bg-bg-main rounded-2xl">
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-1">{t('leave_type')}</p>
          <p className="text-sm font-bold text-text-primary">{t(request.leaveType.toLowerCase() as any)}</p>
          <p className="text-[10px] text-text-secondary">{request.duration} {t('days')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('request_details')}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bg-main rounded-lg text-text-secondary"><Calendar className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-text-secondary font-bold uppercase">{t('period')}</p>
              <p className="text-sm text-text-primary font-medium">{request.startDate} {t('to')} {request.endDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bg-main rounded-lg text-text-secondary"><MessageSquare className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-text-secondary font-bold uppercase">{t('reason')}</p>
              <p className="text-sm text-text-primary">{request.reason}</p>
            </div>
          </div>
          {request.contactDuringLeave && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bg-main rounded-lg text-text-secondary"><User className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase">{t('contact_during_leave')}</p>
                <p className="text-sm text-text-primary">{request.contactDuringLeave}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Timeline */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('approval_history')}</h3>
        <div className="space-y-4 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border-base">
          <div className="flex gap-4 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${request.managerApprovedBy ? 'bg-emerald-500 text-white' : 'bg-bg-main text-text-secondary'}`}>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{t('dept_manager_approval')}</p>
              {request.managerApprovedBy ? (
                <p className="text-xs text-text-secondary">{t('approved_by_on').replace('{{name}}', request.managerApprovedBy).replace('{{date}}', request.managerApprovedAt || '')}</p>
              ) : request.status === 'Rejected' && request.stage === 'Manager' ? (
                <p className="text-xs text-rose-500 font-medium">{t('rejected_at_stage')}</p>
              ) : (
                <p className="text-xs text-text-secondary italic">{t('pending_review')}</p>
              )}
            </div>
          </div>
          <div className="flex gap-4 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${request.hrApprovedBy ? 'bg-emerald-500 text-white' : 'bg-bg-main text-text-secondary'}`}>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{t('hr_final_approval')}</p>
              {request.hrApprovedBy ? (
                <p className="text-xs text-text-secondary">{t('approved_by_on').replace('{{name}}', request.hrApprovedBy).replace('{{date}}', request.hrApprovedAt || '')}</p>
              ) : request.status === 'Rejected' && request.stage === 'HR' ? (
                <p className="text-xs text-rose-500 font-medium">{t('rejected_at_stage')}</p>
              ) : (
                <p className="text-xs text-text-secondary italic">{t('pending_review')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {request.rejectionReason && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
          <p className="text-xs font-bold text-rose-800 uppercase tracking-widest mb-1">{t('rejection_reason')}</p>
          <p className="text-sm text-rose-700">{request.rejectionReason}</p>
        </div>
      )}
    </div>
  );
};
