import React, { useState } from 'react';
import { Drawer } from '../../../components/ui/Drawer';
import { Incident, OHRole } from '../types';
import { PrivacyValue } from './PrivacyValue';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Calendar, MapPin, User, FileText, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface IncidentDrawerProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  role: OHRole;
  onCloseCase?: (id: string, note: string) => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({ 
  incident, 
  isOpen, 
  onClose, 
  role,
  onCloseCase
}) => {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);
  const [closureNote, setClosureNote] = useState('');

  if (!incident) return null;

  const handleCloseCase = () => {
    if (!closureNote.trim()) return;
    onCloseCase?.(incident.id, closureNote);
    setIsClosing(false);
    setClosureNote('');
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${t('incident_details')}: ${incident.id}`}
      footer={role === 'OHO' && incident.status !== 'Closed' && (
        <div className="w-full space-y-4">
          {isClosing ? (
            <div className="space-y-3 p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-rose-900">{t('provide_closure_note')}</p>
                <button onClick={() => setIsClosing(false)} className="text-rose-500 hover:text-rose-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                required
                className="w-full p-3 bg-white border border-rose-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                placeholder={t('closure_note_placeholder')}
                rows={3}
                value={closureNote}
                onChange={(e) => setClosureNote(e.target.value)}
              />
              <button 
                onClick={handleCloseCase}
                disabled={!closureNote.trim()}
                className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('confirm_close_case')}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsClosing(true)}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t('close_case')}
              </button>
              <button className="flex-1 py-2.5 bg-white border border-border-main text-text-primary rounded-xl text-sm font-medium hover:bg-bg-main transition-all">
                {t('edit_details')}
              </button>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-8">
        {/* Header Info */}
        <div className="flex items-center justify-between p-4 bg-bg-main rounded-2xl border border-border-main">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-border-main flex items-center justify-center shadow-sm">
              <ShieldAlert className={`w-6 h-6 ${
                incident.severity === 'Critical' ? 'text-rose-500' : 
                incident.severity === 'High' ? 'text-orange-500' : 'text-blue-500'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{incident.type}</h3>
              <p className="text-sm text-text-secondary">{incident.date}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge label={incident.status} type={
              incident.status === 'Closed' ? 'slate' : 
              incident.status === 'Resolved' ? 'emerald' : 'blue'
            } />
            <StatusBadge label={incident.severity} type={
              incident.severity === 'Critical' ? 'rose' : 
              incident.severity === 'High' ? 'orange' : 'blue'
            } />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3" />
              {t('employee')}
            </p>
            <p className="text-sm font-medium text-text-primary">{incident.employeeName}</p>
            <p className="text-xs text-text-secondary font-mono">{incident.employeeId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {t('location')}
            </p>
            <p className="text-sm font-medium text-text-primary">{incident.location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {t('reported_by')}
            </p>
            <p className="text-sm font-medium text-text-primary">{incident.reportedBy}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              {t('closed_date')}
            </p>
            <p className="text-sm font-medium text-text-primary">{incident.closedDate || 'N/A'}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('description')}</p>
          <div className="p-4 bg-white rounded-xl border border-border-main text-sm text-text-primary leading-relaxed">
            {incident.description}
          </div>
        </div>

        {/* Action Taken */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('action_taken')}</p>
          <div className="p-4 bg-white rounded-xl border border-border-main text-sm text-text-primary leading-relaxed italic">
            {incident.actionTaken || t('no_actions_recorded')}
          </div>
        </div>

        {/* Closure Note (if closed) */}
        {incident.status === 'Closed' && incident.closureNote && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">{t('closure_note')}</p>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-sm text-rose-900 leading-relaxed font-medium">
              {incident.closureNote}
            </div>
          </div>
        )}

        {/* Confidential Notes - Restricted */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('confidential_notes')} ({t('oho_only')})</p>
          <div className="p-4 bg-bg-main rounded-xl border border-dashed border-border-main text-sm text-text-primary">
            <PrivacyValue 
              value={incident.confidentialNotes || '-'} 
              role={role} 
              requiredRole="OHO" 
              resourceName={`Incident ${incident.id} Confidential Notes`}
            />
          </div>
        </div>

      </div>
    </Drawer>
  );
};
