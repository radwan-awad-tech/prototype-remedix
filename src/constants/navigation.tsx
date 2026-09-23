import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Clock, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  CreditCard, 
  HeartPulse, 
  BarChart3, 
  Settings, 
  ShieldCheck
} from 'lucide-react';
import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { 
    title: 'Dashboard', 
    path: '/', 
    icon: <LayoutDashboard className="w-5 h-5" />, 
    roles: ['HR Manager', 'HR Officer', 'Department Head', 'System Admin', 'Payroll Officer', 'Accountant', 'Occupational Health Officer'],
    translationKey: 'dashboard' 
  },
  { 
    title: 'People', 
    path: '/people', 
    translationKey: 'people',
    children: [
      { title: 'Employees', path: '/employees', icon: <Users className="w-5 h-5" />, translationKey: 'employees' },
      { title: 'Doctors', path: '/doctors', icon: <Stethoscope className="w-5 h-5" />, roles: ['HR Manager', 'HR Officer', 'Department Head', 'System Admin'], translationKey: 'doctors' },
    ]
  },
  { 
    title: 'Workforce Management', 
    path: '/workforce', 
    translationKey: 'workforce_management',
    children: [
      { title: 'Scheduling', path: '/scheduling', icon: <Calendar className="w-5 h-5" />, translationKey: 'scheduling' },
      { title: 'Leaves', path: '/leaves', icon: <Clock className="w-5 h-5" />, translationKey: 'leaves' },
      { title: 'Attendance', path: '/attendance', icon: <FileText className="w-5 h-5" />, translationKey: 'attendance' },
    ]
  },
  { 
    title: 'Compliance & Documents', 
    path: '/compliance', 
    translationKey: 'compliance_documents',
    children: [
      { title: 'Licenses', path: '/licenses', icon: <ShieldCheck className="w-5 h-5" />, translationKey: 'licenses' },
    ]
  },
  { 
    title: 'Talent', 
    path: '/talent', 
    translationKey: 'talent',
    children: [
      { title: 'Recruitment', path: '/recruitment', icon: <Briefcase className="w-5 h-5" />, translationKey: 'recruitment' },
    ]
  },
  { title: 'Performance', path: '/performance', icon: <TrendingUp className="w-5 h-5" />, translationKey: 'performance' },
  { title: 'Payroll', path: '/payroll', icon: <CreditCard className="w-5 h-5" />, translationKey: 'payroll' },
  { 
    title: 'Occupational Health', 
    path: '/health-root', 
    translationKey: 'health',
    children: [
      { title: 'Occupational Health', path: '/health', icon: <HeartPulse className="w-5 h-5" />, roles: ['HR Manager', 'HR Officer', 'Department Head', 'System Admin', 'Occupational Health Officer'], translationKey: 'health' },
    ]
  },
  { title: 'Reports', path: '/reports', icon: <BarChart3 className="w-5 h-5" />, roles: ['HR Manager', 'Department Head', 'Accountant', 'System Admin'], translationKey: 'reports' },
  { title: 'Administration', path: '/admin', icon: <Settings className="w-5 h-5" />, roles: ['System Admin', 'HR Manager'], translationKey: 'admin' },
];
