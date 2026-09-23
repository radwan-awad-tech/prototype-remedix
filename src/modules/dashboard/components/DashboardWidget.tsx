import React from 'react';
import { Loader2 } from 'lucide-react';

interface DashboardWidgetProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
  headerBorder?: boolean;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  subtitle,
  icon,
  actions,
  isLoading,
  children,
  className = '',
  contentClassName = '',
  noPadding = false,
  headerBorder = false,
}) => {
  return (
    <div className={`card-base flex flex-col h-full overflow-hidden ${className}`}>
      {(title || icon || actions) && (
        <div className={`px-6 py-4 flex items-center justify-between gap-4 ${headerBorder ? 'border-b border-border-base' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            {icon && <div className="text-brand-primary-end shrink-0">{icon}</div>}
            <div className="overflow-hidden">
              {title && <h3 className="text-sm font-bold text-text-primary truncate">{title}</h3>}
              {subtitle && <p className="text-[10px] text-text-secondary truncate mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      
      <div className={`flex-1 relative ${noPadding ? '' : 'p-6'} ${contentClassName}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary-end" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
