import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, Plus, File, Trash2, Eye, FolderOpen } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { documentService } from '../../services/documentService';
import { employeeService } from '../../services/employeeService';
import { Document, RoleType, Employee } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../auth/AuthContext';

interface DocumentCenterProps {
  userRole: RoleType;
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({ userRole }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    fileName: '',
    docType: '',
    entityType: 'Employee' as Document['entityType'],
    entityId: '',
    department: ''
  });
  const { showToast, success, error: showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, empsRes] = await Promise.all([
          documentService.listDocuments(),
          employeeService.listEmployees()
        ]);
        
        if (docsRes.success) setDocuments(docsRes.data);
        if (empsRes.success) setEmployees(empsRes.data);
      } catch (err) {
        console.error('Failed to fetch document center data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let data = documents;
    
    // Role-based filtering
    if (user?.role === 'Employee') {
      data = data.filter(doc => doc.uploadedBy === user.name || (doc.entityType === 'Employee' && doc.entityId === user.id));
    } else if (user?.role === 'Department Head' && user.department) {
      data = data.filter(doc => doc.department === user.department);
    }
    
    return data.filter(doc => {
      const matchesSearch = doc.fileName && doc.fileName.toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchesEntity = entityFilter === 'All' || doc.entityType === entityFilter;
      return matchesSearch && matchesEntity;
    });
  }, [searchQuery, entityFilter, user, documents]);

  const handleDelete = async (id: string) => {
    try {
      const response = await documentService.deleteDocument(id);
      if (response.success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        showToast(t('document_deleted_success'), 'info');
      }
    } catch (err) {
      showError(t('failed_to_delete'));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFormData.fileName || !uploadFormData.docType || !uploadFormData.entityId) {
      showToast(t('field_required'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedEmployee = employees.find(emp => emp.id === uploadFormData.entityId);
      
      const response = await documentService.uploadDocument({
        ...uploadFormData,
        uploadedBy: user?.name || 'Unknown',
        department: selectedEmployee?.department || uploadFormData.department || 'N/A',
        filePath: 'https://picsum.photos/seed/doc/800/1200'
      });

      if (response.success) {
        success(t('upload_success'));
        setDocuments(prev => [response.data, ...prev]);
        setIsUploadDrawerOpen(false);
        setUploadFormData({
          fileName: '',
          docType: '',
          entityType: 'Employee',
          entityId: '',
          department: ''
        });
      }
    } catch (err) {
      showError(t('failed_to_save'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: t('file_name'), accessor: (row: Document) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary-start/10 rounded text-brand-primary-end">
          <File size={16} />
        </div>
        <span className="font-medium text-gray-900">{row.fileName}</span>
      </div>
    )},
    { header: t('type'), accessor: (row: Document) => row.docType },
    { header: t('linked_to'), accessor: (row: Document) => `${t(row.entityType.toLowerCase() as any)} (${row.entityId})` },
    { header: t('department'), accessor: (row: Document) => row.department || t('not_available') },
    { header: t('uploaded_by'), accessor: (row: Document) => row.uploadedBy },
    { header: t('date'), accessor: (row: Document) => new Date(row.uploadedAt).toLocaleDateString() },
    { header: t('actions'), accessor: (row: Document) => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-gray-400 hover:text-brand-primary-end hover:bg-brand-primary-start/10 rounded-lg transition-all" title={t('view')}>
          <Eye size={16} />
        </button>
        <button className="p-1.5 text-gray-400 hover:text-brand-primary-end hover:bg-brand-primary-start/10 rounded-lg transition-all" title={t('download')}>
          <Download size={16} />
        </button>
        {userRole === 'HR Manager' && (
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" 
            title={t('delete')}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-primary-start/10 rounded-xl text-brand-primary-end">
            <FolderOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('total_files')}</p>
            <p className="text-xl font-bold text-gray-900">1,284</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <File size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('prof_licenses')}</p>
            <p className="text-xl font-bold text-gray-900">452</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <File size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('cert_training')}</p>
            <p className="text-xl font-bold text-gray-900">832</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <Trash2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('recently_deleted')}</p>
            <p className="text-xl font-bold text-gray-900">12</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search_docs_placeholder')}
              className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="All">{t('all_entities')}</option>
              <option value="Employee">{t('employee')}</option>
              <option value="Qualification">{t('qualification')}</option>
              <option value="Recruitment">{t('recruitment')}</option>
              <option value="OH">{t('occupational_health')}</option>
              <option value="Payroll">{t('payroll')}</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsUploadDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 btn-gradient-primary text-white rounded-lg transition-all text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            {t('upload_document')}
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
      />

      <Drawer
        isOpen={isUploadDrawerOpen}
        onClose={() => setIsUploadDrawerOpen(false)}
        title={t('upload_document')}
      >
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('file_name')}</label>
            <input
              type="text"
              required
              placeholder={t('file_name')}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={uploadFormData.fileName}
              onChange={(e) => setUploadFormData(prev => ({ ...prev, fileName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('type')}</label>
            <select
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              value={uploadFormData.docType}
              onChange={(e) => setUploadFormData(prev => ({ ...prev, docType: e.target.value }))}
            >
              <option value="">{t('select_type')}</option>
              <option value="License Scan">{t('prof_licenses')}</option>
              <option value="Certification">{t('cert_training')}</option>
              <option value="ID Scan">{t('identification')}</option>
              <option value="Contract">{t('contract')}</option>
              <option value="Other">{t('other')}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('entity_type')}</label>
              <select
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
                value={uploadFormData.entityType}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, entityType: e.target.value as Document['entityType'] }))}
              >
                <option value="Employee">{t('employee')}</option>
                <option value="Qualification">{t('qualification')}</option>
                <option value="Recruitment">{t('recruitment')}</option>
                <option value="OH">{t('occupational_health')}</option>
                <option value="Payroll">{t('payroll')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('entity_id')}</label>
              <input
                type="text"
                required
                placeholder="ID-123"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
                value={uploadFormData.entityId}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, entityId: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('upload_file')}</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-all">
              <Plus size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">{t('click_to_upload')}</p>
              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => setIsUploadDrawerOpen(false)}
              className="flex-1 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 btn-gradient-primary text-white rounded-lg font-medium shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? t('uploading') : t('upload')}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
