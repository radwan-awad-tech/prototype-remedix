import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../auth/AuthContext';
import { EmployeeOverview } from './components/EmployeeOverview';
import { ManagementOverview } from './components/ManagementOverview';

interface DashboardOverviewProps {
  department?: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ department: filterDepartment }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [chartsData, setChartsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isEmployee = user?.role === 'Employee';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const department = filterDepartment || (user?.role === 'Department Head' ? user.department : undefined);
        const [statsRes, chartsRes] = await Promise.all([
          dashboardService.getStats(department),
          dashboardService.getChartsData(department)
        ]);
        
        if (statsRes.success) setStats(statsRes.data);
        if (chartsRes.success) setChartsData(chartsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, filterDepartment]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-end"></div>
      </div>
    );
  }

  if (isEmployee) {
    return <EmployeeOverview />;
  }

  return <ManagementOverview stats={stats} chartsData={chartsData} user={user} />;
};
