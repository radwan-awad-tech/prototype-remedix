import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';

interface AccessDeniedPageProps {
  onGoBack: () => void;
  onGoHome: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ onGoBack, onGoHome }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6"
      >
        <ShieldAlert className="w-10 h-10" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-text-primary mb-2">{t('access_denied')}</h1>
      <p className="text-text-secondary max-w-md mb-8">
        {t('access_denied_desc')}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button 
          onClick={onGoBack}
          className="flex items-center gap-2 px-6 py-2.5 border border-border-base rounded-xl text-text-primary font-medium hover:bg-bg-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('go_back')}
        </button>
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-primary text-white rounded-xl font-medium shadow-lg shadow-brand-primary-start/20 transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          {t('go_home')}
        </button>
      </div>
    </div>
  );
};
