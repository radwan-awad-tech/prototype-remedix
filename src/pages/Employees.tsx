import React, { useState, useEffect } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageHeader } from '../components/ui/PageHeader';
import { employeeService } from '../services/employeeService';
import { Employee } from '../types';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { EmployeeProfile } from '../modules/employees/EmployeeProfile';
import { AddEmployeeWizard } from '../modules/employees/AddEmployeeWizard';
import { ForceLTR } from '../components/ForceLTR';
import { Plus, Download, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../modules/auth/AuthContext';

export const EmployeesPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { info } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [employeeToTerminate, setEmployeeToTerminate] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const response = await employeeService.listEmployees(dept);
        if (response.success) {
          let filteredData = response.data;
          
          // Role-based record-level visibility for Employee role
          if (user?.role === 'Employee') {
            filteredData = filteredData.filter(emp => emp.email === user.email);
          }
          
          setEmployees(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch employees', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [user]);

  const columns = [
    { 
      header: 'ID', 
      accessor: (row: Employee) => <ForceLTR className="font-mono text-xs">{row.employeeNo}</ForceLTR>,
      translationKey: 'id' as const
    },
    { 
      header: 'Name', 
      accessor: (row: Employee) => `${row.firstName} ${row.lastName}`, 
      className: 'font-semibold',
      translationKey: 'name' as const
    },
    { 
      header: 'Department', 
      accessor: (row: Employee) => {
        const deptKey = row.department ? row.department.toLowerCase().replace(/\s+/g, '_') : '';
        const key = deptKey === 'human_resources' ? 'hr' : deptKey;
        return t(key as any);
      },
      translationKey: 'department' as const
    },
    { 
      header: 'Position', 
      accessor: (row: Employee) => {
        const key = row.position ? row.position.toLowerCase().replace(/\s+/g, '_') : '';
        return t(key as any);
      },
      translationKey: 'position' as const
    },
    { 
      header: 'Hire Date', 
      accessor: 'hireDate' as const,
      translationKey: 'hire_date' as const
    },
    { 
      header: 'Status', 
      accessor: (row: Employee) => <StatusBadge status={row.status} />,
      translationKey: 'status' as const
    },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (emp.employeeNo && emp.employeeNo.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
      (emp.email && emp.email.toLowerCase().includes((searchQuery || '').toLowerCase()));
    
    const matchesDept = departmentFilter === '' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === '' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleExportEmployees = () => {
    if (filteredEmployees.length === 0) return;
    const headers = ['ID', 'Name', 'Department', 'Role', 'Status', 'Email'].join(',');
    const rows = filteredEmployees.map(e => [
      e.employeeNo,
      `"${e.firstName} ${e.lastName}"`,
      `"${e.department}"`,
      `"${e.role}"`,
      e.status,
      e.email
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    info('Employees list exported successfully');
  };

  const headerActions = (
    <>
      <button 
        onClick={handleExportEmployees}
        className="btn-secondary flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {t('download')}
      </button>
      <button 
        onClick={() => setIsWizardOpen(true)}
        hidden={!['Senior Manager','HR Manager'].includes(user?.role || '')}
        className="btn-gradient-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        {t('add_employee')}
      </button>
    </>
  );

  const tableHeaderActions = (
    <div className="flex items-center gap-2">
      <select 
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
        className="input-base"
      >
        <option value="">{t('all_departments')}</option>
        <option value="Nursing">{t('nursing')}</option>
        <option value="Emergency">{t('emergency')}</option>
        <option value="Radiology">{t('radiology')}</option>
        <option value="Human Resources">{t('hr')}</option>
        <option value="Pediatrics">{t('pediatrics')}</option>
      </select>
      <select 
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="input-base"
      >
        <option value="">{t('all_status')}</option>
        <option value="Active">{t('active')}</option>
        <option value="Inactive">{t('inactive')}</option>
      </select>
      <button 
        onClick={() => {
          setDepartmentFilter('');
          setStatusFilter('');
          setSearchQuery('');
        }}
        className="btn-secondary p-2"
        title={t('filter')}
      >
        <Filter className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Employees" 
        titleKey="employees"
        subtitle="Manage hospital staff and their records."
        subtitleKey="employees_subtitle"
        actions={headerActions}
      />

      <DataTable 
        data={filteredEmployees} 
        columns={columns} 
        onRowClick={(row) => setSelectedEmployee(row)}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        searchTranslationKey="search_placeholder_employees"
        headerActions={tableHeaderActions}
        isLoading={isLoading}
        tableId="employees_main"
        rowActions={(row) => [
          { 
            label: t('view_details'), 
            onClick: () => setSelectedEmployee(row),
            icon: <Eye size={14} />
          },
          { 
            label: t('edit'), 
            onClick: () => info('Edit functionality coming soon'),
            icon: <Edit size={14} />
          },
          { 
            label: t('terminate'), 
            onClick: () => {
              setEmployeeToTerminate(row);
              setIsTerminateModalOpen(true);
            },
            icon: <Trash2 size={14} />,
            variant: 'danger' as const
          }
        ].filter(action => action.label !== t('terminate') || ['Senior Manager','HR Manager'].includes(user?.role || ''))}
      />

      {/* Profile Drawer */}
      <Drawer
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        size="xl"
        noPadding
      >
        {selectedEmployee && (
          <EmployeeProfile 
            employee={selectedEmployee} 
            onClose={() => setSelectedEmployee(null)} 
          />
        )}
      </Drawer>

      {/* Add Wizard Modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title={t('add_employee')}
        size="lg"
      >
        <AddEmployeeWizard 
          onClose={() => setIsWizardOpen(false)} 
          onComplete={async (data) => {
            try {
              const response = await employeeService.createEmployee(data);
              if (response.success) {
                const listResponse = await employeeService.listEmployees();
                if (listResponse.success) {
                  setEmployees(listResponse.data);
                }
                info(t('employee_added_success'));
                setIsWizardOpen(false);
              }
            } catch (error) {
              console.error('Failed to add employee', error);
            }
          }} 
        />
      </Modal>

      <Modal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        title={t('terminate_employee')}
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsTerminateModalOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={() => {
                if (!['Senior Manager','HR Manager'].includes(user?.role || '')) return;
                info(t('feature_coming_soon'));
                setIsTerminateModalOpen(false);
              }}
              className="flex-1 px-4 py-2 bg-rose-600 rounded-xl text-sm font-bold text-white hover:bg-rose-700 transition-colors"
            >
              {t('terminate')}
            </button>
          </div>
        }
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {t('are_you_sure')}
          </h3>
          <p className="text-sm text-text-secondary">
            You are about to terminate {employeeToTerminate?.firstName} {employeeToTerminate?.lastName}. This action will revoke their access and initiate the offboarding process.
          </p>
        </div>
      </Modal>
    </div>
  );
};
