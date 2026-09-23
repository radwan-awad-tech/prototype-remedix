import React from 'react';
import { OccupationalHealthView } from '../modules/occupationalHealth/OccupationalHealthView';
import { useAuth } from '../modules/auth/AuthContext';

export const OccupationalHealthPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <OccupationalHealthView user={user} />
    </div>
  );
};
