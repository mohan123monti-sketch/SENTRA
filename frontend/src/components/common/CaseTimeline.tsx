import React from 'react';
import { CaseRecord, CaseStage, CheckInRecord, InterventionRecord } from '../../types/sentra';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  HeartHandshake, 
  ShieldCheck, 
} from 'lucide-react';

interface CaseTimelineProps {
  caseRecord: CaseRecord;
  checkIns?: CheckInRecord[];
  interventions?: InterventionRecord[];
  interactive?: boolean;
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ 
  caseRecord, 
  interventions = [],
}) => {
  const stages: { id: CaseStage; label: string }[] = [
    { id: 'complaint_registered', label: 'Complaint Registered' },
    { id: 'investigation', label: 'Investigation' },
    { id: 'case_proceedings', label: 'Case Proceedings' },
    { id: 'trial', label: 'Trial & Examination' },
    { id: 'compensation_support', label: 'Compensation / Support' },
    { id: 'rehabilitation', label: 'Rehabilitation' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === caseRecord.stage);

  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Official Case Timeline</h2>
      </div>

      <div className="relative pl-2 md:pl-4">
        {/* Vertical Line */}
        <div className="absolute left-6 md:left-8 top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
        
        {/* Timeline Items */}
        <div className="space-y-8 relative">
          {stages.map((stage, idx) => {
            const status = getStageStatus(idx);
            const stageUpdates = caseRecord.officialUpdates.filter(u => u.stage === stage.id);
            
            return (
              <div key={stage.id} className="flex gap-4 md:gap-6 relative">
                
                {/* Node Icon */}
                <div className="relative z-10 shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                    status === 'completed'
                      ? 'bg-teal-500 border-white dark:border-slate-900 text-white'
                      : status === 'current'
                      ? 'bg-white dark:bg-slate-900 border-teal-500 text-teal-600 ring-4 ring-teal-50 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 border-white dark:border-slate-900 text-slate-400'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : status === 'current' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-mono font-bold">{idx + 1}</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className={`text-base font-bold ${
                    status === 'current' 
                      ? 'text-teal-900 dark:text-teal-100' 
                      : status === 'completed'
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400'
                  }`}>
                    {stage.label}
                    {status === 'current' && (
                      <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                        Current Phase
                      </span>
                    )}
                  </h3>

                  {/* Stage Updates */}
                  {stageUpdates.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {stageUpdates.map((u, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{u.title}</span>
                            <span className="text-slate-500 font-mono text-xs flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {u.date}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{u.details}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Support Info for Current Stage */}
                  {status === 'current' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <div className="bg-white border border-teal-100 rounded-lg p-3 flex gap-3 shadow-sm">
                         <HeartHandshake className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-xs font-bold text-slate-800">Support Interactions</div>
                           <div className="text-[11px] text-slate-500 mt-1">{interventions.length} Caseworker intervention(s) logged.</div>
                         </div>
                       </div>
                       <div className="bg-white border border-slate-200 rounded-lg p-3 flex gap-3 shadow-sm">
                         <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-xs font-bold text-slate-800">Protection Coordination</div>
                           <div className="text-[11px] text-slate-500 mt-1">Courtroom escort assigned for proceeding.</div>
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
