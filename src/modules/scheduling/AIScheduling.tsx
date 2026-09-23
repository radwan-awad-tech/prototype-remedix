import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Settings,
  Activity,
  ChevronRight,
  Info,
  RefreshCw,
  Database,
  FileText,
  Brain
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';
import { aiModelService } from '../../services/aiModelService';

// --- IMPROVED SYNTHETIC DATA GENERATOR ---
const generateHospitalEnvironment = (mode = 'normal') => {
  const staffNames = [
    "Dr. Alice Smith", "Nurse Joy Wilson", "Dr. Gregory House", 
    "Nurse Mildred Ratched", "Dr. Meredith Grey", "Nurse Jackie Peyton", 
    "Dr. Stephen Strange", "Nurse Clara Barton", "Dr. John Watson", "Nurse Beth Greene"
  ];

  // Adjust parameters based on "Mode"
  const distMultiplier = mode === 'remote' ? 2 : 1;
  const reliabilityFloor = mode === 'crisis' ? 0.4 : 0.6;

  const staff = staffNames.map((name, index) => ({
    id: 101 + index,
    name,
    distance: (Math.floor(Math.random() * 45) + 5) * distMultiplier,
    baseReliability: (reliabilityFloor + Math.random() * (1 - reliabilityFloor)).toFixed(2),
    department: index % 2 === 0 ? "Emergency" : "General Medicine",
    performance: Math.floor(Math.random() * 20) + 80,
  }));

  const demand = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const isWeekend = dayName === 'Sat' || dayName === 'Sun';
    
    // Normal: 120-220, Crisis: 200-350
    const basePatients = mode === 'crisis' ? 220 : 130;
    const patients = isWeekend 
      ? Math.floor(Math.random() * 60) + (basePatients + 50) 
      : Math.floor(Math.random() * 40) + basePatients;
    
    return {
      date: date.toISOString().split('T')[0],
      day: dayName,
      patients,
    };
  });

  return { staff, demand };
};

export const AIScheduling: React.FC = () => {
  const { t } = useTranslation();
  const [envMode, setEnvMode] = useState('normal');
  const [data, setData] = useState(() => generateHospitalEnvironment('normal'));
  const [selectedDate, setSelectedDate] = useState(data.demand[0].date);
  const [nurseRatio, setNurseRatio] = useState(4);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'data'
  const [aiModelsLoaded, setAiModelsLoaded] = useState(false);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // Initialize AI models on component mount
  useEffect(() => {
    const initializeAIModels = async () => {
      try {
        setIsProcessingAI(true);
        
        // Validate model files
        const validation = await aiModelService.validateModelFiles();
        if (!validation.success) {
          console.error('Model validation failed:', validation.error);
          return;
        }

        // Load AI models
        const [patientsModel, absenceModel] = await Promise.all([
          aiModelService.loadPatientsCountModel(),
          aiModelService.loadAbsencePredictionModel()
        ]);

        if (patientsModel.success && absenceModel.success) {
          setModelInfo({
            patientsCountModel: patientsModel.data,
            absencePredictionModel: absenceModel.data,
            paths: validation.data?.paths
          });
          setAiModelsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to initialize AI models:', error);
      } finally {
        setIsProcessingAI(false);
      }
    };

    initializeAIModels();
  }, []);

  const refreshData = async (mode: string) => {
    const newData = generateHospitalEnvironment(mode);
    setData(newData);
    setSelectedDate(newData.demand[0].date);
    setEnvMode(mode);

    // If AI models are loaded, get real predictions
    if (aiModelsLoaded) {
      try {
        setIsProcessingAI(true);
        
        // Get AI predictions for patient count
        const patientPredictions = await Promise.all(
          newData.demand.map(day => 
            aiModelService.predictPatientCount(day.date, [])
          )
        );

        // Get AI predictions for staff absence
        const staffPredictions = await aiModelService.predictStaffAbsence(newData.staff);

        // Update data with AI predictions if successful
        if (patientPredictions.every(p => p.success) && staffPredictions.success) {
          const updatedDemand = newData.demand.map((day, index) => ({
            ...day,
            patients: patientPredictions[index].data?.predictedPatients || day.patients,
            aiConfidence: patientPredictions[index].data?.confidence || 0.85
          }));

          const updatedStaff = newData.staff.map((staff, index) => ({
            ...staff,
            aiAbsenceRisk: staffPredictions.data[index]?.predictedAbsenceRisk || 0.1,
            aiConfidence: staffPredictions.data[index]?.confidence || 0.85
          }));

          setData({ staff: updatedStaff, demand: updatedDemand });
        }
      } catch (error) {
        console.error('Failed to get AI predictions:', error);
      } finally {
        setIsProcessingAI(false);
      }
    }
  };

  // Model Logic Simulation
  const currentDayData = data.demand.find(d => d.date === selectedDate) || data.demand[0];
  const requiredStaffCount = Math.ceil(currentDayData.patients / nurseRatio);

  const calculateRisk = useCallback((member) => {
    // Use AI prediction if available, otherwise fall back to simulation
    if (aiModelsLoaded && member.aiAbsenceRisk !== undefined) {
      return member.aiAbsenceRisk.toFixed(2);
    }
    
    // Fallback to simulation
    const distanceWeight = member.distance / 120;
    const isWeekend = currentDayData.day === 'Sat' || currentDayData.day === 'Sun' ? 0.18 : 0;
    const randomNoise = Math.random() * 0.08;
    return Math.min(0.98, distanceWeight + isWeekend + randomNoise).toFixed(2);
  }, [currentDayData, aiModelsLoaded]);

  const staffWithRisk = useMemo(() => {
    return data.staff.map(s => ({ ...s, currentRisk: calculateRisk(s) }))
      .sort((a, b) => a.currentRisk - b.currentRisk);
  }, [data.staff, calculateRisk]);

  const scheduledStaff = staffWithRisk.slice(0, requiredStaffCount);
  const highRiskStaff = scheduledStaff.filter(s => s.currentRisk > 0.45);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Activity className="text-brand-primary-start" />
            AI Staff Scheduling
          </h1>
          <p className="text-text-secondary text-sm">Smart scheduling powered by AI predictions</p>
        </div>

        <div className="flex items-center gap-3 card-base p-2">
          <div className="flex items-center gap-2">
            {aiModelsLoaded ? (
              <div className="flex items-center gap-1 text-emerald-600">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">AI Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <span className="text-xs font-medium">
                  {isProcessingAI ? 'Loading AI...' : 'AI Standby'}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-1 border-r border-border-base pr-3 mr-1">
            {['normal', 'crisis', 'remote'].map((m) => (
              <button
                key={m}
                onClick={() => refreshData(m)}
                disabled={isProcessingAI}
                className={`p-1.5 rounded-md transition ${envMode === m ? 'bg-brand-primary-start/10 text-brand-primary-start' : 'text-text-secondary hover:bg-bg-main'} ${isProcessingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={`Load ${m} scenario`}
              >
                <RefreshCw size={16} className={envMode === m ? 'animate-spin-slow' : ''} />
              </button>
            ))}
          </div>
          <Calendar className="text-brand-primary-start" size={18} />
          <select 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none focus:ring-0 font-medium cursor-pointer text-sm"
          >
            {data.demand.map(d => (
              <option key={d.date} value={d.date}>{d.day}, {d.date}</option>
            ))}
          </select>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setView('dashboard')}
          className={`text-sm font-medium px-3 py-1 rounded-md transition ${view === 'dashboard' ? 'btn-gradient-primary text-white' : 'text-text-secondary hover:bg-bg-main'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setView('data')}
          className={`text-sm font-medium px-3 py-1 rounded-md transition ${view === 'data' ? 'btn-gradient-primary text-white' : 'text-text-secondary hover:bg-bg-main'}`}
        >
          Raw Synthetic Logs
        </button>
      </div>

      {view === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Demand Forecasting (Model 1) */}
          <div className="lg:col-span-8 space-y-6">
            <section className="card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="text-brand-primary-start" size={20} />
                  Model 1: Demand Prediction
                </h2>
                <div className="flex items-center gap-4 bg-bg-main px-3 py-1.5 rounded-lg border border-border-base">
                   <div className="text-xs font-bold text-text-secondary">RATIO 1:{nurseRatio}</div>
                   <input 
                    type="range" min="2" max="6" value={nurseRatio} 
                    onChange={(e) => setNurseRatio(parseInt(e.target.value))}
                    className="w-20 accent-brand-primary-start"
                   />
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.demand}>
                    <defs>
                      <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ED1B2" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4ED1B2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF2" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis hide />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#4ED1B2" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorPatients)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-brand-primary-start/10 p-4 rounded-xl">
                  <p className="text-[10px] text-brand-primary-start font-bold uppercase tracking-wider mb-1">Forecasted Inflow</p>
                  <h3 className="text-2xl font-bold text-text-primary">{currentDayData.patients}</h3>
                  <p className="text-xs text-text-secondary">Total Patients</p>
                </div>
                <div className="bg-gradient-primary p-4 rounded-xl text-white">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Target Staffing</p>
                  <h3 className="text-2xl font-bold">{requiredStaffCount}</h3>
                  <p className="text-xs">Headcount Needed</p>
                </div>
                <div className="bg-bg-main p-4 rounded-xl border border-border-base">
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1">System Health</p>
                  <h3 className="text-2xl font-bold text-text-primary">92%</h3>
                  <p className="text-xs text-text-secondary">Data Reliability</p>
                </div>
                <div className="bg-bg-main p-4 rounded-xl border border-border-base">
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1">Scenario</p>
                  <h3 className="text-xl font-bold text-text-primary capitalize">{envMode}</h3>
                  <p className="text-xs text-text-secondary">Current Context</p>
                </div>
              </div>
            </section>

            {/* Staff Profiler (Model 2) */}
            <section className="card-base p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <UserCheck className="text-brand-primary-end" size={20} />
                Model 2: Risk Profile Assessment
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-text-secondary text-xs uppercase tracking-wider border-b border-border-base">
                      <th className="pb-4 font-bold">Employee</th>
                      <th className="pb-4 font-bold">Commute</th>
                      <th className="pb-4 font-bold">Historical Score</th>
                      <th className="pb-4 font-bold">Predicted Absence Risk</th>
                      <th className="pb-4 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-base">
                    {staffWithRisk.map((member) => (
                      <tr key={member.id} className="group hover:bg-bg-main/80 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-primary-start/10 flex items-center justify-center text-brand-primary-start font-bold text-sm">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-text-primary text-sm">{member.name}</p>
                              <p className="text-[10px] text-text-secondary font-medium">{member.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1 text-text-primary text-xs">
                            <MapPin size={12} className="text-text-secondary" />
                            {member.distance}km
                          </div>
                        </td>
                        <td className="py-4">
                           <div className="text-xs font-bold text-text-primary">{(member.baseReliability * 100).toFixed(0)}%</div>
                           <div className="w-20 bg-bg-main h-1 rounded-full mt-1">
                              <div className="bg-brand-primary-end h-full rounded-full" style={{ width: `${member.baseReliability * 100}%` }}></div>
                           </div>
                        </td>
                        <td className="py-4">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${
                            member.currentRisk > 0.5 ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 
                            member.currentRisk > 0.3 ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' : 
                            'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                          }`}>
                            {(member.currentRisk * 100).toFixed(0)}% Probability
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <button className="p-1 text-text-secondary hover:text-brand-primary-start"><ChevronRight size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Sidebar: Intelligent Schedule */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-gradient-primary text-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar size={20} />
                  AI Roster
                </h2>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase font-black tracking-widest">Live</span>
              </div>
              <p className="text-white/80 text-xs mb-6">
                The system has selected {scheduledStaff.length} personnel with the lowest risk scores for {currentDayData.day}.
              </p>
              
              <div className="space-y-2">
                {scheduledStaff.map(member => (
                  <div key={member.id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold border border-white/30">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{member.name}</p>
                        <p className="text-[9px] text-white/60 uppercase tracking-tighter">{member.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 bg-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/30 transition-all active:scale-95 shadow-lg">
                Finalize Schedule
              </button>
            </section>

            {/* AI Management Alerts */}
            <section className="card-base p-5">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <AlertTriangle className="text-amber-500" size={16} />
                Insights & Alerts
              </h3>
              <div className="space-y-3">
                {highRiskStaff.length > 0 ? (
                  <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                    <p className="text-xs font-black text-red-700 uppercase">Attention Needed</p>
                    <p className="text-[11px] text-red-600 mt-1 leading-relaxed">
                      {highRiskStaff.length} team members are flagged as High Absence Risk for this shift. 
                    </p>
                    <button className="mt-2 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                      Request Backup
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-500">
                    <p className="text-xs font-black text-emerald-700 uppercase">Shift Secured</p>
                    <p className="text-[11px] text-emerald-600 mt-1">
                      Personnel reliability exceeds safety threshold (85%).
                    </p>
                  </div>
                )}

                <div className="bg-bg-main p-4 rounded-xl border border-border-base flex gap-3">
                  <Info className="text-brand-primary-start shrink-0" size={16} />
                  <div className="text-[10px] text-text-secondary italic leading-relaxed">
                    Strategy: Lowering the Nurse-to-Patient ratio by 1 point would require {Math.ceil(currentDayData.patients / (nurseRatio + 1))} staff, improving cost efficiency by 12%.
                  </div>
                </div>
              </div>
            </section>

            {/* AI Health Stats */}
            <section className="card-base p-5">
               <div className="flex items-center gap-2 mb-4">
                 <Settings className="text-text-secondary" size={16} />
                 <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">AI Confidence</h4>
               </div>
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1 font-bold text-text-secondary">
                      <span>COST OPTIMIZATION</span>
                      <span className="text-brand-primary-start">94%</span>
                    </div>
                    <div className="w-full bg-bg-main h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-primary h-full w-[94%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1 font-bold text-text-secondary">
                      <span>PREDICTION ACCURACY</span>
                      <span className="text-brand-primary-start">88%</span>
                    </div>
                    <div className="w-full bg-bg-main h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-primary h-full w-[88%]"></div>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="text-brand-primary-start" />
              Synthetic System Logs
            </h2>
            <div className="text-xs text-text-secondary font-mono">
              Showing entries for Scenario: {envMode.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-text-secondary mb-3 flex items-center gap-2">
                <FileText size={14} /> Personnel Metadata (DBA Input)
              </h3>
              <pre className="bg-slate-900 text-brand-primary-start p-4 rounded-xl text-[10px] overflow-auto max-h-[400px] leading-relaxed">
                {JSON.stringify(data.staff, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-secondary mb-3 flex items-center gap-2">
                <FileText size={14} /> Demand Forecast Logs (Model 1 Output)
              </h3>
              <pre className="bg-slate-900 text-brand-primary-end p-4 rounded-xl text-[10px] overflow-auto max-h-[400px] leading-relaxed">
                {JSON.stringify(data.demand, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            {modelInfo && (
              <div className="p-4 bg-gradient-primary/10 rounded-xl border border-brand-primary-start/20">
                <h4 className="text-sm font-bold text-brand-primary-start mb-3 flex items-center gap-2">
                  <Brain size={16} />
                  AI Model Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-text-secondary mb-1">Patients Count Model</p>
                    <p className="text-[10px] text-text-primary font-mono">{modelInfo.paths?.patientsCountModel}</p>
                    <p className="text-[10px] text-text-secondary">Accuracy: {((modelInfo.patientsCountModel?.accuracy || 0) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary mb-1">Staff Absence Model</p>
                    <p className="text-[10px] text-text-primary font-mono">{modelInfo.paths?.absencePredictionModel}</p>
                    <p className="text-[10px] text-text-secondary">Accuracy: {((modelInfo.absencePredictionModel?.accuracy || 0) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-brand-primary-start/10 rounded-xl border border-brand-primary-start/20">
              <p className="text-xs text-brand-primary-start leading-relaxed font-medium">
                <strong>How to test:</strong> Use the refresh icons in the header to switch between "Normal", "Crisis", and "Remote" modes. Notice how the 
                <strong> Distance</strong> values change in "Remote" mode and <strong>Patient Count</strong> surges in "Crisis" mode. 
                The AI Dashboard will react in real-time to these raw data changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
