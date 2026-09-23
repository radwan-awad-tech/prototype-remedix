import React, { useState, useEffect } from 'react';
import { Check, X, Eye, MessageSquare } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { qualificationService } from '../../services/qualificationService';
import { Qualification, RoleType } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../auth/AuthContext';

interface VerificationQueueProps {
  userRole: RoleType;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({ userRole }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Verified' | 'Rejected'>('Pending');
  const [selectedQual, setSelectedQual] = useState<Qualification | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const response = await qualificationService.listQualifications(dept);
        if (response.success) {
          let filteredData = response.data;
          
          // Role-based filtering for Employee
          if (user?.role === 'Employee') {
            filteredData = filteredData.filter(q => q.employeeId === user.id);
          }
          
          setQualifications(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch qualifications', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQualifications();
  }, [user]);

  const filteredData = qualifications.filter(q => q.verificationStatus === activeTab);

  const handleVerify = async () => {
    if (!selectedQual) return;
    try {
      const response = await qualificationService.verifyQualification(selectedQual.id);
      if (response.success) {
        setQualifications(prev => prev.map(q => q.id === selectedQual.id ? { ...q, verificationStatus: 'Verified' } : q));
        showToast(t('verification_success'), 'success');
        setIsDrawerOpen(false);
      } else {
        showToast(response.message || t('verification_failed'), 'error');
      }
    } catch (error) {
      console.error('Failed to verify qualification', error);
    }
  };

  const handleReject = async () => {
    if (!selectedQual || !rejectionReason) {
      showToast(t('provide_rejection_reason'), 'error');
      return;
    }
    try {
      const response = await qualificationService.rejectQualification(selectedQual.id, rejectionReason);
      if (response.success) {
        setQualifications(prev => prev.map(q => q.id === selectedQual.id ? { ...q, verificationStatus: 'Rejected' } : q));
        showToast(t('rejection_success'), 'info');
        setIsRejectModalOpen(false);
        setIsDrawerOpen(false);
        setRejectionReason('');
      } else {
        showToast(response.message || t('rejection_failed'), 'error');
      }
    } catch (error) {
      console.error('Failed to reject qualification', error);
    }
  };

  const columns = [
    { header: t('employee'), accessor: (row: Qualification) => row.employeeName },
    { header: t('type'), accessor: (row: Qualification) => t(row.type === 'License' ? 'prof_licenses' : 'cert_training') },
    { header: t('name'), accessor: (row: Qualification) => row.name },
    { header: t('expiry_date'), accessor: (row: Qualification) => row.expiryDate },
    { header: t('status'), accessor: (row: Qualification) => (
      <StatusBadge status={row.status} />
    )},
    { header: t('verification'), accessor: (row: Qualification) => (
      <StatusBadge status={row.verificationStatus} />
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        {(['Pending', 'Verified', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === tab 
              ? 'bg-white text-brand-primary-end shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab ? t(tab.toLowerCase() as any) : ''}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(row) => {
          setSelectedQual(row);
          setIsDrawerOpen(true);
        }}
        isLoading={isLoading}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={t('verification_review')}
      >
        {selectedQual && (
          <div className="space-y-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-1">{selectedQual.employeeName}</h4>
              <p className="text-sm text-gray-500">{selectedQual.department} • {selectedQual.employeeNo}</p>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-gray-900">{t('qualification_details')}</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500">{t('type')}</p>
                  <p className="text-sm font-medium">{t(selectedQual.type === 'License' ? 'prof_licenses' : 'cert_training')}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500">{t('number')}</p>
                  <p className="text-sm font-medium">{selectedQual.number}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500">{t('name')}</p>
                  <p className="text-sm font-medium">{selectedQual.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 flex items-center justify-between">
                {t('doc_preview_placeholder')}
                <button className="text-xs text-brand-primary-end hover:underline flex items-center gap-1">
                  <Eye size={14} /> {t('open_fullscreen')}
                </button>
              </h5>
              <div className="aspect-[3/4] bg-gray-900 rounded-xl flex items-center justify-center text-white/50 flex-col gap-3 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-xs font-medium">{selectedQual.documentUrl.split('/').pop()}</p>
                </div>
                <Eye size={48} className="opacity-20" />
                <p className="text-sm font-medium">{t('doc_preview_placeholder')}</p>
              </div>
            </div>

            {selectedQual.verificationStatus === 'Pending' && (userRole === 'HR Manager' || userRole === 'HR Officer') && (
              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={handleVerify}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all"
                >
                  <Check size={18} />
                  {t('verify')}
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
          </div>
        )}
      </Drawer>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={t('reject_verification')}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{t('rejection_reason_desc')}</p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-400" />
              {t('rejection_reason')}
            </label>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end min-h-[120px]"
              placeholder={t('rejection_reason_placeholder')}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
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
    </div>
  );
};
