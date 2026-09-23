import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';

export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
      <EmptyState 
        title={`${title} Module`} 
        description="This module is currently under development. Stay tuned for updates!" 
        action={
          <button className="btn-gradient-primary px-6 py-2 rounded-lg font-medium text-sm">
            Go Back to Dashboard
          </button>
        }
      />
    </div>
  );
};
