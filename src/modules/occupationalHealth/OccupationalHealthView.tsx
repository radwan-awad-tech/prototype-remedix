import React, { useState, useEffect } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { KPICard } from '../../components/ui/KPICard';
import { useTranslation } from '../../hooks/useTranslation';
import { PageHeader } from '../../components/ui/PageHeader';
import { IncidentsTable } from './components/IncidentsTable';
import { VaccinationsTable } from './components/VaccinationsTable';
import { MedicalCheckupsTable } from './components/MedicalCheckupsTable';
import { FollowUpsTable } from './components/FollowUpsTable';
import { ComplianceAlertsTable } from './components/ComplianceAlertsTable';
import { IncidentDrawer } from './components/IncidentDrawer';
import { ReportIncidentForm } from './components/ReportIncidentForm';
import { AddVaccinationForm } from './components/AddVaccinationForm';
import { ScheduleCheckupForm } from './components/ScheduleCheckupForm';
import { Drawer } from '../../components/ui/Drawer';
import { Incident, getOHRole, Vaccination, MedicalCheckup, FollowUp } from './types';
import { occupationalHealthService } from '../../services/occupationalHealthService';
import { User } from '../../types';
import { ShieldAlert, Syringe, ClipboardCheck, CalendarClock, Lock } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

interface OccupationalHealthViewProps {
  user: User;
}

export const OccupationalHealthView: React.FC<OccupationalHealthViewProps> = ({ user }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('incidents');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isIncidentDrawerOpen, setIsIncidentDrawerOpen] = useState(false);
  const [isReportIncidentOpen, setIsReportIncidentOpen] = useState(false);
  const [isAddVaccinationOpen, setIsAddVaccinationOpen] = useState(false);
  const [isScheduleCheckupOpen, setIsScheduleCheckupOpen] = useState(false);
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [checkups, setCheckups] = useState<MedicalCheckup[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { showToast } = useToast();

  const ohRole = getOHRole(user.role);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [incRes, vacRes, chkRes, folRes] = await Promise.all([
          occupationalHealthService.getIncidents(user, ohRole),
          occupationalHealthService.getVaccinations(user, ohRole),
          occupationalHealthService.getCheckups(user, ohRole),
          occupationalHealthService.getFollowUps(user, ohRole),
        ]);
        
        if (incRes.success) setIncidents(incRes.data);
        if (vacRes.success) setVaccinations(vacRes.data);
        if (chkRes.success) setCheckups(chkRes.data);
        if (folRes.success) setFollowUps(folRes.data);
      } catch (error) {
        showToast(t('failed_fetch_data'), 'error');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [user, ohRole]);

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsIncidentDrawerOpen(true);
  };

  const handleCloseCase = (id: string, note: string) => {
    // In a real app, this would be an API call
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { 
        ...inc, 
        status: 'Closed', 
        closedDate: new Date().toISOString().split('T')[0], 
        closedBy: user?.name,
        closureNote: note
      } : inc
    ));
    setIsIncidentDrawerOpen(false);
    showToast(t('case_closed_success'), 'success');
  };

  const handleReportIncident = async (data: any) => {
    try {
      const response = await occupationalHealthService.reportIncident({
        employeeId: data.employeeId,
        employeeName: `${t('employee')} ${data.employeeId}`, // Mock name
        department: data.department,
        type: data.type,
        severity: data.severity,
        date: new Date().toISOString().split('T')[0],
        location: data.location,
        reportedBy: user?.name || 'System',
        description: data.description,
        actionTaken: data.actionTaken,
        confidentialNotes: data.confidentialNotes,
      });
      
      if (response.success) {
        setIncidents(prev => [response.data, ...prev]);
        setIsReportIncidentOpen(false);
        showToast(t('incident_reported_success'), 'success');
      } else {
        showToast(response.message || t('incident_reported_failed'), 'error');
      }
    } catch (error) {
      showToast(t('incident_reported_failed'), 'error');
    }
  };

  const handleAddVaccination = async (data: any) => {
    try {
      const response = await occupationalHealthService.addVaccination({
        employeeId: data.employeeId,
        employeeName: `${t('employee')} ${data.employeeId}`, // Mock name
        department: data.department,
        vaccineName: data.vaccineName,
        doseNumber: data.doseNumber,
        totalDoses: data.totalDoses || 1,
        dateAdministered: data.dateAdministered,
        nextDoseDate: data.nextDoseDate,
        status: 'Completed',
        provider: data.provider,
        notes: data.notes,
      });
      
      if (response.success) {
        setVaccinations(prev => [response.data, ...prev]);
        setIsAddVaccinationOpen(false);
        showToast(t('vaccination_added_success'), 'success');
      } else {
        showToast(response.message || t('vaccination_added_failed'), 'error');
      }
    } catch (error) {
      showToast(t('vaccination_added_failed'), 'error');
    }
  };

  const handleScheduleCheckup = async (data: any) => {
    try {
      const response = await occupationalHealthService.scheduleCheckup({
        employeeId: data.employeeId,
        employeeName: `${t('employee')} ${data.employeeId}`, // Mock name
        department: data.department,
        type: data.type,
        date: data.scheduledDate,
        physician: data.physician,
      });
      
      if (response.success) {
        setCheckups(prev => [response.data, ...prev]);
        setIsScheduleCheckupOpen(false);
        showToast(t('checkup_scheduled_success'), 'success');
      } else {
        showToast(response.message || t('checkup_scheduled_failed'), 'error');
      }
    } catch (error) {
      showToast(t('checkup_scheduled_failed'), 'error');
    }
  };

  const handleCompleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: 'Completed' } : f));
    showToast(t('follow_up_completed_success'), 'success');
  };

  const tabs = [
    { id: 'incidents', label: t('incidents'), icon: <ShieldAlert className="w-4 h-4" />, translationKey: 'incidents' as const },
    { id: 'vaccinations', label: t('vaccinations'), icon: <Syringe className="w-4 h-4" />, translationKey: 'vaccinations' as const },
    { id: 'medical_checkups', label: t('medical_checkups'), icon: <ClipboardCheck className="w-4 h-4" />, translationKey: 'medical_checkups' as const },
    { id: 'follow_ups', label: t('follow_ups'), icon: <CalendarClock className="w-4 h-4" />, translationKey: 'follow_ups' as const },
    { id: 'compliance_alerts', label: t('compliance_alerts'), icon: <ShieldAlert className="w-4 h-4" />, translationKey: 'compliance_alerts' as const },
  ];

  // Role-based summary data
  const getSummaryStats = () => {
    if (ohRole === 'DEPT_HEAD') {
      const activeInc = incidents.filter(i => i.status !== 'Closed').length;
      return [
        { title: t('active_cases'), value: activeInc.toString(), icon: <ShieldAlert />, trend: t('trend_week') },
        { title: t('compliance_rate'), value: '94%', icon: <ClipboardCheck />, trend: t('trend_stable') },
      ];
    }
    return [
      { title: t('active_cases'), value: incidents.filter(i => i.status !== 'Closed').length.toString(), icon: <ShieldAlert />, trend: t('trend_high_priority') },
      { title: t('vaccination_coverage'), value: '88%', icon: <Syringe />, trend: t('trend_month') },
      { title: t('pending_checkups'), value: checkups.filter(c => c.status !== 'Completed').length.toString(), icon: <ClipboardCheck />, trend: t('trend_pre_employment') },
      { title: t('pending_followups'), value: followUps.filter(f => f.status !== 'Completed').length.toString(), icon: <CalendarClock />, trend: t('trend_action_required') },
    ];
  };

  const headerActions = (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border-base text-xs font-medium text-text-secondary shadow-sm">
      <Lock className="w-3.5 h-3.5" />
      {ohRole === 'OHO' ? t('full_access') : ohRole === 'HR_COMPLIANCE' ? t('compliance_access') : t('summary_access')}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Occupational Health" 
        titleKey="health"
        subtitle="Manage workplace safety, employee health records, and medical compliance with strict privacy controls."
        subtitleKey="health_subtitle"
        actions={headerActions}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getSummaryStats().map((stat, index) => (
          <div 
            key={index} 
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => {
              if (stat.title === t('active_cases')) setActiveTab('incidents');
              if (stat.title === t('vaccination_coverage')) setActiveTab('vaccinations');
              if (stat.title === t('pending_checkups')) setActiveTab('medical_checkups');
              if (stat.title === t('pending_followups')) setActiveTab('follow_ups');
              if (stat.title === t('compliance_rate')) setActiveTab('compliance_alerts');
            }}
          >
            <KPICard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="card-base p-1 inline-flex bg-bg-main/50">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pill" />
        </div>
        
        <div className="card-base overflow-hidden">
          {isLoadingData ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary-main/30 border-t-primary-main rounded-full animate-spin" />
              <p className="text-sm text-text-secondary">{t('loading')}</p>
            </div>
          ) : (
            <>
              {activeTab === 'incidents' && (
                <IncidentsTable 
                  role={ohRole} 
                  onViewDetails={handleViewIncident} 
                  onReportIncident={() => setIsReportIncidentOpen(true)}
                  data={incidents}
                />
              )}
              {activeTab === 'vaccinations' && (
                <VaccinationsTable 
                  role={ohRole} 
                  data={vaccinations}
                  onAdd={() => setIsAddVaccinationOpen(true)}
                />
              )}
              {activeTab === 'medical_checkups' && (
                <MedicalCheckupsTable 
                  role={ohRole} 
                  data={checkups}
                  onSchedule={() => setIsScheduleCheckupOpen(true)}
                />
              )}
              {activeTab === 'follow_ups' && (
                <FollowUpsTable 
                  role={ohRole} 
                  data={followUps}
                  onComplete={handleCompleteFollowUp}
                />
              )}
              {activeTab === 'compliance_alerts' && (
                <ComplianceAlertsTable 
                  role={ohRole} 
                  vaccinations={vaccinations}
                  checkups={checkups}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Drawers */}
      <IncidentDrawer 
        incident={selectedIncident}
        isOpen={isIncidentDrawerOpen}
        onClose={() => setIsIncidentDrawerOpen(false)}
        role={ohRole}
        onCloseCase={handleCloseCase}
      />

      {/* Report Incident Drawer */}
      <Drawer
        isOpen={isReportIncidentOpen}
        onClose={() => setIsReportIncidentOpen(false)}
        title={t('report_incident')}
        subtitle={t('report_incident_subtitle')}
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsReportIncidentOpen(false)} 
              type="button"
              className="flex-1 px-4 py-2 border border-border-base text-text-secondary rounded-xl font-bold hover:bg-bg-main transition-all"
            >
              {t('cancel')}
            </button>
            <button 
              form="report-incident-form"
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              {t('report_incident')}
            </button>
          </div>
        }
      >
        <ReportIncidentForm 
          onClose={() => setIsReportIncidentOpen(false)} 
          onSubmit={handleReportIncident} 
        />
      </Drawer>

      {/* Add Vaccination Drawer */}
      <Drawer
        isOpen={isAddVaccinationOpen}
        onClose={() => setIsAddVaccinationOpen(false)}
        title={t('add_vaccination')}
        subtitle={t('add_vaccination_subtitle')}
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsAddVaccinationOpen(false)} 
              type="button"
              className="flex-1 px-4 py-2 border border-border-base text-text-secondary rounded-xl font-bold hover:bg-bg-main transition-all"
            >
              {t('cancel')}
            </button>
            <button 
              form="add-vaccination-form"
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              {t('add_vaccination')}
            </button>
          </div>
        }
      >
        <AddVaccinationForm 
          onClose={() => setIsAddVaccinationOpen(false)} 
          onSubmit={handleAddVaccination} 
        />
      </Drawer>

      {/* Schedule Checkup Drawer */}
      <Drawer
        isOpen={isScheduleCheckupOpen}
        onClose={() => setIsScheduleCheckupOpen(false)}
        title={t('schedule_checkup')}
        subtitle={t('schedule_checkup_subtitle')}
        footer={
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsScheduleCheckupOpen(false)} 
              type="button"
              className="flex-1 px-4 py-2 border border-border-base text-text-secondary rounded-xl font-bold hover:bg-bg-main transition-all"
            >
              {t('cancel')}
            </button>
            <button 
              form="schedule-checkup-form"
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              {t('schedule_checkup')}
            </button>
          </div>
        }
      >
        <ScheduleCheckupForm 
          onClose={() => setIsScheduleCheckupOpen(false)} 
          onSubmit={handleScheduleCheckup} 
        />
      </Drawer>
    </div>
  );
};
