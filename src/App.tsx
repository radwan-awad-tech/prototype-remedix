import React, { useState, useMemo, useEffect } from 'react';
import { DashboardPage } from './pages/Dashboard';
import { EmployeesPage } from './pages/Employees';
import { SchedulingPage } from './pages/Scheduling';
import { LeavesPage } from './pages/Leaves';
import { AttendancePage } from './pages/Attendance';
import { LicensesPage } from './pages/Licenses';
import RecruitmentPage from './pages/Recruitment';
import PerformancePage from './pages/Performance';
import { PayrollPage } from './pages/Payroll';
import { DoctorsPage } from './pages/Doctors';
import { OccupationalHealthPage } from './pages/OccupationalHealth';
import ReportsPage from './pages/Reports';
import AdministrationPage from './pages/Administration';
import { UserSettingsPage } from './pages/UserSettings';
import { ProfilePage } from './pages/Profile';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './modules/auth/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { LoginPage } from './modules/auth/LoginPage';
import { AccessDeniedPage } from './modules/auth/AccessDeniedPage';
import { canAccessPath, getLandingPath } from './modules/auth/permissions';
import { AppShell } from './layout/AppShell';
import { ToastProvider } from './components/ui/Toast';
import { ScopedWorkspace } from './pages/ScopedWorkspace';
import { RoleAccessPage } from './pages/RoleAccess';
import { getModuleAccess } from './modules/auth/permissions';
import { HealthAdministrationPage } from './pages/HealthAdministration';

const AppContent = () => {
  const { currentPath, navigate } = useNavigation();
  const [previousPath, setPreviousPath] = useState('/');
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Handle role-based landing page
  useEffect(() => {
    if (isAuthenticated && user && currentPath === '/') {
      const landingPath = getLandingPath(user.role);
      if (landingPath !== '/') {
        navigate(landingPath);
      }
    }
  }, [isAuthenticated, user, currentPath, navigate]);

  const isRedirecting = useMemo(() => {
    if (isAuthenticated && user && currentPath === '/') {
      return getLandingPath(user.role) !== '/';
    }
    return false;
  }, [isAuthenticated, user, currentPath]);

  const handleNavigate = (path: string) => {
    setPreviousPath(currentPath);
    navigate(path);
  };

  const renderPage = useMemo(() => {
    if (!user || isRedirecting) return null;

    // Check permissions
    if (!canAccessPath(user.role, currentPath)) {
      return (
        <AccessDeniedPage 
          onGoBack={() => navigate(previousPath)} 
          onGoHome={() => navigate(getLandingPath(user.role))} 
        />
      );
    }

    if (currentPath === '/access') return <RoleAccessPage />;
    if (currentPath === '/health' && ['HR Manager','HR Officer'].includes(user.role)) return <HealthAdministrationPage />;
    if (currentPath === '/' || (currentPath !== '/reports' &&
      !['/settings', '/profile', '/admin'].includes(currentPath) && getModuleAccess(user.role, currentPath)?.level !== 'manage')) {
      return <ScopedWorkspace key={`${user.id}:${currentPath}`} path={currentPath} />;
    }
    switch (currentPath) {
      case '/': return <DashboardPage />;
      case '/employees': return <EmployeesPage />;
      case '/scheduling': return <SchedulingPage />;
      case '/leaves': return <LeavesPage />;
      case '/attendance': return <AttendancePage userRole={user.role} />;
      case '/licenses': return <LicensesPage userRole={user.role} />;
      case '/doctors': return <DoctorsPage />;
      case '/recruitment': return <RecruitmentPage />;
      case '/performance': return <PerformancePage />;
      case '/payroll': return <PayrollPage />;
      case '/health': return <OccupationalHealthPage />;
      case '/reports': return <ReportsPage />;
      case '/admin': return <AdministrationPage />;
      case '/settings': return <UserSettingsPage />;
      case '/profile': return <ProfilePage />;
      default: return <DashboardPage />;
    }
  }, [currentPath, user, previousPath, isRedirecting]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary-start/30 border-t-brand-primary-start rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  return (
    <AppShell
      user={user}
      activePath={currentPath}
      onNavigate={handleNavigate}
      onLogout={() => { logout(); navigate('/'); }}
    >
      {renderPage}
    </AppShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ToastProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </ToastProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}
