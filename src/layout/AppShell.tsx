import React from 'react';
import { Sidebar } from './Sidebar';
import { User, RoleType } from '../types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { motion, AnimatePresence } from 'motion/react';

interface AppShellProps {
  children: React.ReactNode;
  user: User;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  user, 
  activePath, 
  onNavigate, 
  onLogout 
}) => {
  return (
    <div className="flex min-h-screen bg-bg-main">
      <Sidebar 
        currentRole={user.role} 
        currentUser={user} 
        activePath={activePath} 
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      
      <main className="relative flex-1 flex flex-col min-w-0 overflow-y-auto px-4 py-5 md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-brand-muted-teal/30" />
        <div className="brand-pattern pointer-events-none absolute end-0 top-0 h-72 w-[42rem]" />
        <Breadcrumbs currentPath={activePath} onNavigate={onNavigate} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activePath}
            className="relative z-10 mx-auto w-full max-w-[1440px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
