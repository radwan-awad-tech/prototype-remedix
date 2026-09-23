import React, { useState, useEffect } from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';
import { AttendanceRecord, Employee } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';

interface ManualEntryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRecord: AttendanceRecord) => void;
}

export const ManualEntryDrawer: React.FC<ManualEntryDrawerProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:00',
    checkOut: '16:00',
    status: 'OK' as AttendanceRecord['status'],
  });

  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        setIsLoadingEmployees(true);
        try {
          const response = await employeeService.listEmployees();
          if (response.success) {
            setEmployees(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch employees', error);
        } finally {
          setIsLoadingEmployees(false);
        }
      };
      fetchEmployees();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      showToast(t('select_employee'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      if (!selectedEmployee) return;

      const newRecordData: Partial<AttendanceRecord> = {
        employeeId: selectedEmployee.id,
        employeeNo: selectedEmployee.employeeNo,
        employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        department: selectedEmployee.department,
        date: formData.date,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        status: formData.status,
        source: 'Manual',
        isCorrected: false,
        totalHours: calculateHours(formData.checkIn, formData.checkOut),
      };

      const response = await attendanceService.createAttendanceRecord(newRecordData);
      if (response.success) {
        showToast(t('manual_entry_success'), 'success');
        onSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Failed to create manual entry', error);
      showToast(t('failed_to_save'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startTotal = startH + startM / 60;
    const endTotal = endH + endM / 60;
    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24; // Handle overnight
    return parseFloat(diff.toFixed(1));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t('manual_attendance_entry')}
      footer={
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            form="manual-entry-form"
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? t('saving') : t('save')}
          </button>
        </div>
      }
    >
      <form id="manual-entry-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('employee')} *</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
            >
              <option value="">{t('select_employee')}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('attendance_date')} *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('check_in_time')}</label>
              <input
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('check_out_time')}</label>
              <input
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')} *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceRecord['status'] })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
            >
              <option value="OK">{t('ok')}</option>
              <option value="Late">{t('late')}</option>
              <option value="Absent">{t('absent')}</option>
              <option value="Missing Checkout">{t('missing_checkout')}</option>
            </select>
          </div>
        </div>
      </form>
    </Drawer>
  );
};
