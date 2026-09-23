import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { LeavePolicy } from '../../types';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useTranslation } from '../../hooks/useTranslation';
import { Settings, Edit2, Check, X, Wallet } from 'lucide-react';
import { Drawer } from '../../components/ui/Drawer';
import { useToast } from '../../components/ui/Toast';

export const LeavePolicies: React.FC = () => {
  const { t } = useTranslation();
  const { success } = useToast();
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicy | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const response = await leaveService.listLeavePolicies();
      if (response.success) {
        setPolicies(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch leave policies', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (policy: LeavePolicy) => {
    setSelectedPolicy(policy);
    setIsDrawerOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend only update simulation
    if (selectedPolicy) {
      setPolicies(prev => prev.map(p => p.id === selectedPolicy.id ? selectedPolicy : p));
      success(t('policy_updated_success'));
      setIsDrawerOpen(false);
    }
  };

  const columns = [
    { 
      header: t('leave_type'), 
      accessor: (row: LeavePolicy) => t(row.leaveType.toLowerCase() as any),
      className: 'font-bold text-text-primary'
    },
    { 
      header: t('annual_entitlement'), 
      accessor: (row: LeavePolicy) => `${row.annualEntitlement} ${t('days')}` 
    },
    { 
      header: t('max_carry_over'), 
      accessor: (row: LeavePolicy) => `${row.maxCarryOver} ${t('days')}` 
    },
    { 
      header: t('min_notice_days'), 
      accessor: (row: LeavePolicy) => `${row.minNoticeDays} ${t('days')}` 
    },
    { 
      header: t('requires_attachment'), 
      accessor: (row: LeavePolicy) => (
        <div className="flex justify-center">
          {row.requiresAttachment ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <X className="w-4 h-4 text-rose-500" />
          )}
        </div>
      )
    },
    { 
      header: t('is_paid'), 
      accessor: (row: LeavePolicy) => (
        <StatusBadge 
          status={row.isPaid ? 'Approved' : 'Rejected'} 
          customLabel={row.isPaid ? t('paid') : t('unpaid')}
        />
      )
    },
    {
      header: t('actions'),
      accessor: (row: LeavePolicy) => (
        <button 
          onClick={() => handleEdit(row)}
          className="p-2 hover:bg-bg-main rounded-lg text-text-secondary transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">{t('types_policies')}</h2>
          <p className="text-xs text-text-secondary">{t('manage_leave_rules')}</p>
        </div>
      </div>

      <DataTable 
        data={policies} 
        columns={columns} 
        isLoading={isLoading}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={t('update_policy')}
      >
        {selectedPolicy && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-bg-main rounded-xl border border-border-base">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">{t('leave_type')}</p>
                <p className="text-sm font-bold text-text-primary">{t(selectedPolicy.leaveType.toLowerCase() as any)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">{t('annual_entitlement')}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                    value={selectedPolicy.annualEntitlement}
                    onChange={e => setSelectedPolicy({...selectedPolicy, annualEntitlement: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">{t('max_carry_over')}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                    value={selectedPolicy.maxCarryOver}
                    onChange={e => setSelectedPolicy({...selectedPolicy, maxCarryOver: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('min_notice_days')}</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                  value={selectedPolicy.minNoticeDays}
                  onChange={e => setSelectedPolicy({...selectedPolicy, minNoticeDays: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-bg-main rounded-xl border border-border-base">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-border-base">
                    <Settings className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{t('requires_attachment')}</p>
                    <p className="text-[10px] text-text-secondary">{t('attachment_policy_desc')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPolicy({...selectedPolicy, requiresAttachment: !selectedPolicy.requiresAttachment})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${selectedPolicy.requiresAttachment ? 'bg-brand-primary-start' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedPolicy.requiresAttachment ? 'end-1' : 'start-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-bg-main rounded-xl border border-border-base">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-border-base">
                    <Wallet className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{t('is_paid')}</p>
                    <p className="text-[10px] text-text-secondary">{t('payment_policy_desc')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPolicy({...selectedPolicy, isPaid: !selectedPolicy.isPaid})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${selectedPolicy.isPaid ? 'bg-brand-primary-start' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedPolicy.isPaid ? 'end-1' : 'start-1'}`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 px-4 py-2 border border-border-base rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-main transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg text-sm font-medium shadow-sm"
              >
                {t('save')}
              </button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
};
