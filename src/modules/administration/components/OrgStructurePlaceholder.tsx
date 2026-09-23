import React, { useState, useMemo } from 'react';
import { Network, Building2, MapPin, Users, Plus, Search, AlertCircle, Share2, Edit2, Trash2, Save, ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { mockOrgUnits } from '../mockData';
import { OrgUnit } from '../types';
import { Drawer } from '../../../components/ui/Drawer';
import { useToast } from '../../../components/ui/Toast';

export const OrgStructurePlaceholder: React.FC = () => {
  const { t } = useTranslation();
  const { success } = useToast();
  const [units, setUnits] = useState<OrgUnit[]>(mockOrgUnits);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['DEPT-001']);

  const filteredUnits = useMemo(() => {
    return units.filter(unit => 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.manager?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [units, searchQuery]);

  const departments = useMemo(() => units.filter(u => u.type === 'department'), [units]);
  
  const getSubUnits = (deptId: string) => units.filter(u => u.parent === deptId);

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsAddDrawerOpen(false);
      success(t('unit_created_success'));
    }, 1000);
  };

  const handleEditUnit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditDrawerOpen(false);
      success(t('settings_saved_success'));
    }, 1000);
  };

  const openEditDrawer = (unit: OrgUnit) => {
    setSelectedUnit(unit);
    setIsEditDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-emerald-800">{t('org_management')}</h4>
          <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
            {t('org_chart_placeholder_desc')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder={t('search_org_placeholder')}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border-base rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors">
            <Share2 className="w-4 h-4" />
            {t('export')}
          </button>
          <button 
            onClick={() => setIsAddDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('add_new_unit')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-border-base p-6 shadow-sm">
            <h3 className="font-bold text-text-primary text-sm mb-4">{t('hospital_hierarchy')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-bg-main border border-border-base">
                <Building2 className="w-4 h-4 text-brand-primary-start" />
                <span className="text-xs font-bold text-text-primary">{t('hospital_name')}</span>
              </div>
              <div className="ml-4 space-y-2 border-l-2 border-border-base pl-4">
                {departments.map(dept => (
                  <div key={dept.id} className="space-y-1">
                    <div 
                      onClick={() => toggleDept(dept.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-main/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        {expandedDepts.includes(dept.id) ? <ChevronDown className="w-3 h-3 text-text-secondary" /> : <ChevronRight className="w-3 h-3 text-text-secondary" />}
                        <span className="text-xs font-bold text-text-primary">{dept.name}</span>
                      </div>
                    </div>
                    {expandedDepts.includes(dept.id) && (
                      <div className="ml-4 space-y-1 border-l border-border-base/50 pl-4">
                        {getSubUnits(dept.id).map(unit => (
                          <div key={unit.id} className="p-2 rounded-lg hover:bg-bg-main/30 transition-colors cursor-pointer">
                            <span className="text-[11px] font-medium text-text-secondary">{unit.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border-base p-6 shadow-sm">
            <h3 className="font-bold text-text-primary text-sm mb-4">{t('location_management')}</h3>
            <div className="space-y-3">
              {[
                { key: 'main_campus', label: t('main_campus') },
                { key: 'west_wing', label: t('west_wing') },
                { key: 'outpatient_clinic', label: t('outpatient_clinic') },
                { key: 'research_center', label: t('research_center') }
              ].map(loc => (
                <div key={loc.key} className="flex items-center gap-3 p-2 rounded-lg bg-bg-main/30 border border-border-base/50">
                  <MapPin className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="text-[11px] font-medium text-text-primary">{loc.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-border-base overflow-hidden flex flex-col min-h-[500px] shadow-sm">
          <div className="p-6 border-b border-border-base flex items-center justify-between bg-bg-main/30">
            <h3 className="font-bold text-text-primary">{t('unit_management')}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 bg-white border border-border-base rounded-lg text-text-secondary">
                {filteredUnits.length} {t('units')}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-bg-main/50 border-b border-border-base">
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('unit_name')}</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('type')}</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('manager')}</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('employees')}</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-bg-main/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          {unit.type === 'department' ? <Building2 className="w-4 h-4" /> : <Network className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-bold text-text-primary">{unit.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-bg-main text-text-secondary border border-border-base">
                        {unit.type === 'department' ? t('level_department') : 
                         unit.type === 'unit' ? t('level_unit') : 
                         unit.type === 'section' ? t('level_section') : unit.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-text-primary">{unit.manager || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="text-xs font-bold text-text-primary">{unit.employeeCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <button 
                        onClick={() => openEditDrawer(unit)}
                        className="p-1.5 rounded-lg hover:bg-bg-main text-text-secondary hover:text-brand-primary-start transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Unit Drawer */}
      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title={t('add_new_unit')}
      >
        <form onSubmit={handleAddUnit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('unit_name')}</label>
                <input required type="text" className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" placeholder="e.g. Cardiology" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('type')}</label>
                <select required className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20">
                  <option value="department">{t('level_department')}</option>
                  <option value="unit">{t('level_unit')}</option>
                  <option value="section">{t('level_section')}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('parent_unit')}</label>
                <select className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20">
                  <option value="">{t('top_level')}</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('manager')}</label>
                <input type="text" className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" placeholder="Search employee..." />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-border-base bg-bg-main/50 flex items-center gap-3">
            <button type="button" onClick={() => setIsAddDrawerOpen(false)} className="flex-1 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Plus className="w-4 h-4" />}
              {t('create_unit')}
            </button>
          </div>
        </form>
      </Drawer>

      {/* Edit Unit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title={t('edit_unit')}
      >
        <form onSubmit={handleEditUnit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedUnit && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('unit_name')}</label>
                  <input required type="text" defaultValue={selectedUnit.name} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('type')}</label>
                  <select required defaultValue={selectedUnit.type} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20">
                    <option value="department">Department</option>
                    <option value="unit">Unit</option>
                    <option value="section">Section</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('manager')}</label>
                  <input type="text" defaultValue={selectedUnit.manager} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" />
                </div>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-border-base bg-bg-main/50 flex items-center gap-3">
            <button type="button" onClick={() => setIsEditDrawerOpen(false)} className="flex-1 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
              {t('save_changes')}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
