import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, User, Activity, FileText, AlertCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { mockAuditLogs } from '../mockData';
import { AuditLog } from '../../../types';
import { Drawer } from '../../../components/ui/Drawer';

export const AuditLogTable: React.FC = () => {
  const { t } = useTranslation();
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  const openDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-800">{t('audit_policy')}</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            {t('audit_log_placeholder_desc')}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder={t('search_logs_placeholder')}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border-base rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors">
            <Filter className="w-4 h-4" />
            {t('filters')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors">
            <Download className="w-4 h-4" />
            {t('export')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-base overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-bg-main/50 border-b border-border-base">
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('timestamp')}</th>
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('actor')}</th>
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('action')}</th>
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('entity')}</th>
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('summary')}</th>
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-end">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-main/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                      <span className="text-xs font-medium text-text-secondary">
                        {log.timestamp}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-text-secondary" />
                      <span className="text-xs font-bold text-text-primary">{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      log.action.includes('CREATE') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      log.action.includes('UPDATE') ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      log.action.includes('DELETE') ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      'bg-bg-main text-text-secondary border border-border-base'
                    }`}>
                      {log.action.includes('CREATE') ? t('action_create') : 
                       log.action.includes('UPDATE') ? t('action_update') : 
                       log.action.includes('DELETE') ? t('action_delete') : log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-text-secondary" />
                      <span className="text-xs font-medium text-text-secondary">{log.entityType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-text-primary line-clamp-1">{log.summary}</p>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <button 
                      onClick={() => openDetails(log)}
                      className="p-1.5 rounded-lg hover:bg-bg-main text-text-secondary hover:text-brand-primary-start transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border-base bg-bg-main/30 flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {t('showing')} 1-{filteredLogs.length} {t('of')} {filteredLogs.length} {t('entries')}
          </span>
          <div className="flex items-center gap-2">
            <button disabled className="p-2 rounded-xl border border-border-base bg-white text-text-secondary disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled className="p-2 rounded-xl border border-border-base bg-white text-text-secondary disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Details Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={t('audit_log_details')}
      >
        <div className="p-6 space-y-6">
          {selectedLog && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-bg-main border border-border-base">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('actor')}</p>
                  <p className="text-sm font-bold text-text-primary">{selectedLog.actor}</p>
                </div>
                <div className="p-4 rounded-2xl bg-bg-main border border-border-base">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('timestamp')}</p>
                  <p className="text-sm font-bold text-text-primary">{selectedLog.timestamp}</p>
                </div>
                <div className="p-4 rounded-2xl bg-bg-main border border-border-base">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('action')}</p>
                  <p className="text-sm font-bold text-text-primary">
                    {selectedLog.action.includes('CREATE') ? t('action_create') : 
                     selectedLog.action.includes('UPDATE') ? t('action_update') : 
                     selectedLog.action.includes('DELETE') ? t('action_delete') : selectedLog.action}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-bg-main border border-border-base">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('entity_type')}</p>
                  <p className="text-sm font-bold text-text-primary">{selectedLog.entityType}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-bg-main border border-border-base">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('summary')}</p>
                <p className="text-sm text-text-primary leading-relaxed">{selectedLog.summary}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">{t('activity_details')}</h4>
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto">
                  <pre>{JSON.stringify({
                    id: selectedLog.id,
                    entityId: selectedLog.entityId,
                    metadata: {
                      ip: '192.168.1.45',
                      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
                      location: 'Main Campus - IT Office'
                    }
                  }, null, 2)}</pre>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="p-6 border-t border-border-base bg-bg-main/50">
          <button 
            onClick={() => setIsDetailOpen(false)}
            className="w-full py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </Drawer>
    </div>
  );
};
