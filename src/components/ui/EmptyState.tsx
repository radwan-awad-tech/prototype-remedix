import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-text-secondary opacity-50" />}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-text-secondary text-sm max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
};
