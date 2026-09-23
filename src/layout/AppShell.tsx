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
      
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <Breadcrumbs currentPath={activePath} onNavigate={onNavigate} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activePath}
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
