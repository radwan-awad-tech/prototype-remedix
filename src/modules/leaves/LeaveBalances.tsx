import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { leaveService } from '../../services/leaveService';
import { RoleType, LeaveBalance, LeaveType } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../auth/AuthContext';
import { Plus, Minus, AlertCircle } from 'lucide-react';

interface LeaveBalancesProps {
  currentRole: RoleType;
}

export const LeaveBalances: React.FC<LeaveBalancesProps> = ({ currentRole }) => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalance | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustment, setAdjustment] = useState({
    type: 'Annual' as LeaveType,
    amount: 0,
    reason: '',
  });

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await leaveService.listLeaveBalances();
        if (response.success) {
          let filteredData = response.data;
          
          // Role-based record-level visibility
          if (currentRole === 'Employee') {
            filteredData = filteredData.filter(b => b.employeeId === user?.employeeId);
          } else if (currentRole === 'Department Head' && user?.department) {
            filteredData = filteredData.filter(b => b.department === user.department);
          }
          
          setBalances(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch leave balances', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalances();
  }, [currentRole, user]);

  const isHR = currentRole === 'HR Manager' || currentRole === 'Senior Manager';

  const columns = [
    { header: 'Employee No', accessor: 'employeeNo' as const, className: 'font-mono text-xs' },
    { header: 'Name', accessor: 'employeeName' as const, className: 'font-semibold' },
    { header: 'Department', accessor: 'department' as const },
    { header: 'Annual Balance', accessor: (row: LeaveBalance) => <span className="font-bold text-brand-primary-end">{row.annual} Days</span> },
    { header: 'Sick Balance', accessor: (row: LeaveBalance) => <span className="font-bold text-amber-600">{row.sick} Days</span> },
    { header: 'Last Updated', accessor: 'lastUpdated' as const, className: 'text-text-secondary text-xs' },
  ];

  const handleAdjust = (balance: LeaveBalance) => {
    if (!isHR) return;
    setSelectedBalance(balance);
    setIsAdjustModalOpen(true);
  };

  const confirmAdjustment = async () => {
    if (!selectedBalance) return;
    try {
      // In a real app, we'd call a service method here
      // await leaveService.adjustBalance(selectedBalance.employeeId, adjustment);
      setIsAdjustModalOpen(false);
      setSelectedBalance(null);
      setAdjustment({ type: 'Annual', amount: 0, reason: '' });
    } catch (error) {
      console.error('Failed to adjust balance', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DataTable 
        data={balances} 
        columns={columns} 
        onRowClick={isHR ? handleAdjust : undefined}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Adjust Leave Balance"
      >
        {selectedBalance && (
          <div className="space-y-6">
            <div className="p-4 bg-bg-main rounded-2xl">
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-1">Employee</p>
              <p className="text-sm font-bold text-text-primary">{selectedBalance.employeeName}</p>
              <p className="text-[10px] text-text-secondary">{selectedBalance.employeeNo}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Leave Type</label>
                <select 
                  value={adjustment.type}
                  onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value as LeaveType })}
                  className="w-full p-3 bg-bg-main border border-border-base rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary-start/20"
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Adjustment Amount (+/- Days)</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setAdjustment({ ...adjustment, amount: adjustment.amount - 1 })}
                    className="p-3 bg-bg-main border border-border-base rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    value={adjustment.amount}
                    onChange={(e) => setAdjustment({ ...adjustment, amount: parseInt(e.target.value) || 0 })}
                    className="flex-1 p-3 bg-bg-main border border-border-base rounded-xl text-center font-bold text-lg outline-none"
                  />
                  <button 
                    onClick={() => setAdjustment({ ...adjustment, amount: adjustment.amount + 1 })}
                    className="p-3 bg-bg-main border border-border-base rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Reason for Adjustment *</label>
                <textarea 
                  value={adjustment.reason}
                  onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                  className="w-full p-3 bg-bg-main border border-border-base rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary-start/20 min-h-[100px]"
                  placeholder="e.g. Correction of carry-over balance"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium">This adjustment will be logged in the audit history and the employee will be notified.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-6 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAdjustment}
                disabled={!adjustment.reason.trim()}
                className="px-8 py-2 text-sm font-bold btn-gradient-primary rounded-xl shadow-lg shadow-brand-primary-start/20 disabled:opacity-50"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
