import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, Plus, FileText, Calendar, RefreshCw } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { qualificationService } from '../../services/qualificationService';
import { employeeService } from '../../services/employeeService';
import { Qualification, RoleType, Employee } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../auth/AuthContext';

interface QualificationsListProps {
  type: 'License' | 'Certification';
  userRole: RoleType;
}

export const QualificationsList: React.FC<QualificationsListProps> = ({ type, userRole }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedQual, setSelectedQual] = useState<Qualification | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFormData, setAddFormData] = useState({
    employeeId: '',
    name: '',
    number: '',
    expiryDate: '',
    documentUrl: 'https://picsum.photos/seed/doc/800/1200'
  });
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const { showToast, info, success, error: showError } = useToast();

  useEffect(() => {
    if (userRole !== 'Employee') {
      const fetchEmployees = async () => {
        try {
          const dept = user?.role === 'Department Head' ? user?.department : undefined;
          const response = await employeeService.listEmployees(dept);
          if (response.success) {
            setEmployees(response.data);
          }
        } catch (err) {
          console.error('Failed to fetch employees', err);
        }
      };
      fetchEmployees();
    }
  }, [userRole, user]);

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

  const filteredData = useMemo(() => {
    return qualifications.filter(q => {
      const matchesType = q.type === type;
      const matchesSearch = 
        (q.employeeName && q.employeeName.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
        (q.name && q.name.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
        (q.number && q.number.toLowerCase().includes((searchQuery || '').toLowerCase()));
      const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
      return matchesType && matchesSearch && matchesStatus;
    });
  }, [qualifications, type, searchQuery, statusFilter]);

  const handleRenew = () => {
    if (!newExpiryDate) {
      showToast(t('provide_expiry_date'), 'error');
      return;
    }
    showToast(t('renew_success', { type: t(type === 'License' ? 'prof_licenses' : 'cert_training'), date: newExpiryDate }), 'success');
    setIsRenewModalOpen(false);
    setIsDrawerOpen(false);
    setNewExpiryDate('');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetEmployeeId = userRole === 'Employee' ? user?.employeeId : addFormData.employeeId;
    
    if (!targetEmployeeId || !addFormData.name || !addFormData.number || !addFormData.expiryDate) {
      showToast(t('field_required'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedEmployee = employees.find(e => e.id === targetEmployeeId) || (userRole === 'Employee' ? user : null);
      
      const response = await qualificationService.addQualification({
        ...addFormData,
        employeeId: targetEmployeeId,
        employeeName: selectedEmployee?.name || 'Unknown',
        employeeNo: (selectedEmployee as any)?.employeeNo || 'N/A',
        department: selectedEmployee?.department || 'N/A',
        type: type
      });

      if (response.success) {
        success(t('add_success'));
        setQualifications(prev => [response.data, ...prev]);
        setIsAddDrawerOpen(false);
        setAddFormData({
          employeeId: '',
          name: '',
          number: '',
          expiryDate: '',
          documentUrl: 'https://picsum.photos/seed/doc/800/1200'
        });
      }
    } catch (err) {
      showError(t('failed_to_save'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: t('employee'), accessor: (row: Qualification) => row.employeeName },
    { header: t('department'), accessor: (row: Qualification) => row.department },
    { header: `${t(type === 'License' ? 'prof_licenses' : 'cert_training')}`, accessor: (row: Qualification) => row.name },
    { header: t('number'), accessor: (row: Qualification) => row.number },
    { header: t('expiry_date'), accessor: (row: Qualification) => row.expiryDate },
    { header: t('status'), accessor: (row: Qualification) => (
      <StatusBadge status={row.status} />
    )},
    { header: t('verification'), accessor: (row: Qualification) => (
      <StatusBadge status={row.verificationStatus} />
    )},
    { header: t('doc'), accessor: (row: Qualification) => row.documentUrl ? (
      <FileText size={18} className="text-brand-primary-end cursor-pointer hover:text-brand-primary-end/80" />
    ) : null },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search_qualifications_placeholder').replace('{type}', t(type === 'License' ? 'prof_licenses' : 'cert_training'))}
              className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">{t('all_statuses')}</option>
              <option value="Valid">{t('valid')}</option>
              <option value="Expiring">{t('expiring')}</option>
              <option value="Expired">{t('expired')}</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => info(t('feature_coming_soon'))}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
          >
            <Download size={18} />
            {t('export_expiry_list')}
          </button>
          <button 
            onClick={() => setIsAddDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 btn-gradient-primary text-white rounded-lg transition-all text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            {t('add_qualification').replace('{type}', t(type === 'License' ? 'prof_licenses' : 'cert_training'))}
          </button>
        </div>
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
        title={t('qualification_details')}
      >
        {selectedQual && (
          <div className="space-y-8">
            <div className="p-6 bg-gradient-to-br from-brand-primary-start to-brand-primary-end rounded-2xl text-white shadow-lg shadow-brand-primary-start/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white/80 text-xs uppercase tracking-wider font-bold mb-1">{selectedQual.type}</p>
                  <h4 className="text-xl font-bold">{selectedQual.name}</h4>
                </div>
                <StatusBadge status={selectedQual.status} className="bg-white/20 text-white border-white/30" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-white/70 text-xs mb-1">{t('number')}</p>
                  <p className="font-mono font-bold">{selectedQual.number}</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs mb-1">{t('expiry_date')}</p>
                  <p className="font-bold">{selectedQual.expiryDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                {t('employee_details')}
              </h5>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">{t('name')}</p>
                  <p className="text-sm font-medium text-gray-900">{selectedQual.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('department')}</p>
                  <p className="text-sm font-medium text-gray-900">{selectedQual.department}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-gray-400" />
                {t('doc_preview_placeholder')}
              </h5>
              <div className="aspect-[4/3] bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 flex-col gap-2">
                <FileText size={48} />
                <p className="text-sm font-medium">{t('click_to_upload')}</p>
                <p className="text-xs">{selectedQual.documentUrl.split('/').pop()}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={() => setIsRenewModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 btn-gradient-primary text-white rounded-lg font-medium"
              >
                <RefreshCw size={18} />
                {t('mark_renewed')}
              </button>
              <button 
                onClick={() => info(t('feature_coming_soon'))}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                <Download size={18} />
                {t('download')}
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        title={t('renew_license')}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{t('renew_license_desc')}</p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('new_expiry_date')}</label>
            <input
              type="date"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={newExpiryDate}
              onChange={(e) => setNewExpiryDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('new_document_optional')}</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-all">
              <Plus size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">{t('click_to_upload')}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsRenewModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleRenew}
              className="px-4 py-2 btn-gradient-primary text-white rounded-lg font-medium"
            >
              {t('update_qualification')}
            </button>
          </div>
        </div>
      </Modal>

      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title={t('add_qualification').replace('{type}', t(type === 'License' ? 'prof_licenses' : 'cert_training'))}
      >
        <form onSubmit={handleAddSubmit} className="space-y-6">
          {userRole !== 'Employee' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('select_employee')}</label>
              <select
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
                value={addFormData.employeeId}
                onChange={(e) => setAddFormData(prev => ({ ...prev, employeeId: e.target.value }))}
              >
                <option value="">{t('select_employee')}</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeNo})</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              required
              placeholder={t(type === 'License' ? 'prof_licenses' : 'cert_training')}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={addFormData.name}
              onChange={(e) => setAddFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('number')}</label>
            <input
              type="text"
              required
              placeholder="LIC-123456"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={addFormData.number}
              onChange={(e) => setAddFormData(prev => ({ ...prev, number: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('expiry_date')}</label>
            <input
              type="date"
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={addFormData.expiryDate}
              onChange={(e) => setAddFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('upload_document')}</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-all">
              <Plus size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">{t('click_to_upload')}</p>
              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => setIsAddDrawerOpen(false)}
              className="flex-1 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 btn-gradient-primary text-white rounded-lg font-medium shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
