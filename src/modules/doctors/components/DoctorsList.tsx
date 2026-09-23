import React, { useState, useMemo } from 'react';
import { FileDown, UserPlus, Search } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { Doctor, DataTableColumn, Employee } from '../../../types';
import { MOCK_EMPLOYEES, MOCK_SPECIALTIES } from '../../../mockData';
import { useTranslation } from '../../../hooks/useTranslation';
import { TranslationKey } from '../../../i18n/translations';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../modules/auth/AuthContext';
import { doctorService } from '../../../services/doctorService';
import { useEffect } from 'react';

interface DoctorsListProps {
  onViewProfile: (doctor: Doctor) => void;
  onEditDoctor: (doctor: Doctor) => void;
  onAddNew: () => void;
}

export const DoctorsList: React.FC<DoctorsListProps> = ({ onViewProfile, onEditDoctor, onAddNew }) => {
  const { t } = useTranslation();
  const { info } = useToast();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [doctorToDeactivate, setDoctorToDeactivate] = useState<Doctor | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const response = await doctorService.listDoctors(dept);
        if (response.success) {
          let filteredData = response.data;
          
          // Role-based filtering for Employee
          if (user?.role === 'Employee') {
            filteredData = filteredData.filter(doc => doc.employeeId === user.id);
          }
          
          setDoctors(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, [user]);

  const getEmployee = (employeeId: string): Employee | undefined => {
    return MOCK_EMPLOYEES.find(emp => emp.id === employeeId);
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const employee = getEmployee(doc.employeeId);
      
      const searchStr = `${doc.doctorCode} ${employee?.firstName} ${employee?.lastName} ${employee?.fullNameAr} ${employee?.employeeNo} ${employee?.phone} ${employee?.email} ${doc.medicalLicenseNumber}`.toLowerCase();
      
      const matchesSearch = searchStr.includes((searchTerm || '').toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'all' || doc.primarySpecialty === selectedSpecialty || doc.specialties.includes(selectedSpecialty);
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;

      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [doctors, searchTerm, selectedSpecialty, selectedStatus]);

  const columns: DataTableColumn<Doctor>[] = [
    {
      header: 'Doctor Code',
      accessor: (row) => <span className="font-mono font-medium text-brand-primary-start">{row.doctorCode}</span>,
      translationKey: 'doctor_code'
    },
    {
      header: 'Full Name',
      accessor: (row) => {
        const emp = getEmployee(row.employeeId);
        return (
          <div className="flex flex-col">
            <span className="font-medium">{emp?.firstName} {emp?.lastName}</span>
            <span className="text-xs text-text-secondary">{emp?.fullNameAr}</span>
          </div>
        );
      },
      translationKey: 'full_name'
    },
    {
      header: 'Department',
      accessor: (row) => {
        const dept = getEmployee(row.employeeId)?.department;
        return dept ? t(dept.toLowerCase() as TranslationKey) : '-';
      },
      translationKey: 'department'
    },
    {
      header: 'Primary Specialty',
      accessor: (row) => row.primarySpecialty ? t(row.primarySpecialty.toLowerCase().replace(' ', '_') as TranslationKey) : '-',
      translationKey: 'primary_specialty'
    },
    {
      header: 'License Status',
      accessor: (row) => {
        const expiryDate = new Date(row.licenseExpiryDate);
        const now = new Date();
        const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return <StatusBadge status="Expired" translationKey="expired" />;
        if (diffDays <= 30) return <StatusBadge status="Expiring" customLabel={t('expiring')} translationKey="expiring" />;
        return <StatusBadge status="Valid" translationKey="valid" />;
      },
      translationKey: 'license_status'
    },
    {
      header: 'License Expiry',
      accessor: (row) => row.licenseExpiryDate,
      translationKey: 'license_expiry'
    },
    {
      header: 'Status',
      accessor: (row) => row.status ? <StatusBadge status={row.status} translationKey={row.status.toLowerCase() as TranslationKey} /> : '-',
      translationKey: 'status'
    }
  ];

  const handleDeactivateClick = (e: React.MouseEvent, doctor: Doctor) => {
    e.stopPropagation();
    setDoctorToDeactivate(doctor);
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = () => {
    // Logic to deactivate doctor
    console.log(`Deactivating doctor ${doctorToDeactivate?.doctorCode} for reason: ${deactivateReason}`);
    setShowDeactivateModal(false);
    setDoctorToDeactivate(null);
    setDeactivateReason('');
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <select
        value={selectedSpecialty}
        onChange={(e) => setSelectedSpecialty(e.target.value)}
        className="px-3 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 transition-all"
      >
        <option value="all">{t('all_specialties')}</option>
        {MOCK_SPECIALTIES.map(s => (
          <option key={s.id} value={s.name}>{s.name ? t(s.name.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="px-3 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 transition-all"
      >
        <option value="all">{t('all_statuses')}</option>
        <option value="Active">{t('active')}</option>
        <option value="Inactive">{t('inactive')}</option>
      </select>

      <button 
        onClick={() => info(t('feature_coming_soon'))}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-lg border border-border-base transition-colors"
      >
        <FileDown className="w-4 h-4" />
        {t('export')}
      </button>

      <button 
        onClick={onAddNew}
        className="btn-gradient-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
      >
        <UserPlus className="w-4 h-4" />
        {t('add_doctor')}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable 
        data={filteredDoctors}
        columns={columns}
        onRowClick={onViewProfile}
        onSearch={setSearchTerm}
        searchTranslationKey="search"
        headerActions={headerActions}
        isLoading={isLoading}
      />

      {/* Deactivate Modal */}
      <Modal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title={t('deactivate_doctor')}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {t('deactivate_confirm_question')} <span className="font-semibold text-text-primary">{getEmployee(doctorToDeactivate?.employeeId || '')?.firstName} {getEmployee(doctorToDeactivate?.employeeId || '')?.lastName}</span>?
            <br />
            {t('deactivate_confirm_message')}
          </p>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {t('deactivate_reason')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              placeholder={t('reason_placeholder')}
              className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setShowDeactivateModal(false)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-main rounded-lg transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={confirmDeactivate}
              disabled={!deactivateReason.trim()}
              className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {t('confirm_deactivation')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
