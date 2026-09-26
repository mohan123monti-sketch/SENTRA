import React, { useState } from 'react';
import { CaseRecord, CaseStage, CheckInRecord, InterventionRecord } from '../../types/sentra';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  FileText, 
  Heart, 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface CaseTimelineProps {
  caseRecord: CaseRecord;
  checkIns?: CheckInRecord[];
  interventions?: InterventionRecord[];
  interactive?: boolean;
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ 
  caseRecord, 
  checkIns = [], 
  interventions = [],
  interactive = true 
}) => {
  const stages: { id: CaseStage; label: string; order: number }[] = [
    { id: 'complaint_registered', label: 'Complaint Registered', order: 1 },
    { id: 'investigation', label: 'Investigation', order: 2 },
    { id: 'case_proceedings', label: 'Case Proceedings', order: 3 },
    { id: 'trial', label: 'Trial & Examination', order: 4 },
    { id: 'compensation_support', label: 'Compensation / Support', order: 5 },
    { id: 'rehabilitation', label: 'Rehabilitation', order: 6 }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === caseRecord.stage);
  const [selectedStage, setSelectedStage] = useState<CaseStage>(caseRecord.stage);

  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'upcoming';
  };

  const selectedStageData = stages.find(s => s.id === selectedStage);
  const stageUpdates = caseRecord.officialUpdates.filter(u => u.stage === selectedStage);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Case Lifecycle & Support Progression
          </span>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>{caseRecord.caseNumber}</span>
            <span className="text-xs font-normal text-slate-500">· {caseRecord.category}</span>
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs text-slate-500">Next Official Hearing</div>
          <div className="text-xs font-semibold text-slate-900 flex items-center sm:justify-end gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            <span>{caseRecord.nextHearingDate}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Multi-stage Track */}
      <div className="pt-6 pb-4 overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between relative px-4">
          {/* Connecting Line Background */}
          <div className="absolute top-4 left-8 right-8 h-1 bg-slate-200 -z-0" />
          {/* Active Progress Fill */}
          <div 
            className="absolute top-4 left-8 h-1 bg-teal-700 -z-0 transition-all duration-300" 
            style={{ 
              width: `${(currentStageIndex / (stages.length - 1)) * 90}%` 
            }} 
          />

          {stages.map((stage, idx) => {
            const status = getStageStatus(idx);
            const isSelected = selectedStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => interactive && setSelectedStage(stage.id)}
                disabled={!interactive}
                className={`flex flex-col items-center text-center group relative z-10 focus:outline-none transition-transform ${
                  interactive ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                }`}
              >
                {/* Node icon */}
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                    status === 'completed'
                      ? 'bg-teal-700 border-teal-700 text-white'
                      : status === 'current'
                      ? 'bg-white border-teal-700 text-teal-800 ring-4 ring-teal-50'
                      : 'bg-white border-slate-300 text-slate-400'
                  } ${isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : status === 'current' ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <span className="text-xs font-mono">{idx + 1}</span>
                  )}
                </div>

                {/* Stage Label */}
                <span 
                  className={`mt-2 text-xs font-medium max-w-[95px] leading-tight ${
                    status === 'current' 
                      ? 'text-teal-900 font-semibold' 
                      : status === 'completed' 
                      ? 'text-slate-800' 
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </span>

                {status === 'current' && (
                  <span className="mt-1 text-[10px] text-teal-700 font-mono uppercase bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail & Well-Being Correlation Overlay */}
      <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Selected Stage: {selectedStageData?.label}
            </span>
            <span className="text-xs text-slate-500">
              ({getStageStatus(stages.findIndex(s => s.id === selectedStage)).toUpperCase()})
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Jurisdiction: {caseRecord.courtName}
          </div>
        </div>

        {/* Stage Official Events */}
        <div className="space-y-2">
          {stageUpdates.length > 0 ? (
            stageUpdates.map((u, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs bg-white p-2.5 rounded border border-slate-200">
                <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">{u.title}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{u.date}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{u.details}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic py-1">
              No previous formal orders filed for this upcoming phase.
            </p>
          )}
        </div>

        {/* Well-Being & Caseworker Intervention Correlation Overlay */}
        <div className="mt-3 pt-3 border-t border-slate-200/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-teal-700" />
            <span>Well-Being & Human Support Overlay for this Period</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded border border-slate-200 flex items-start gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-800">Support Interactions</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {interventions.length} Caseworker intervention(s) logged. Weekly check-in response rate 92%.
                </p>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded border border-slate-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-800">Protection Coordination</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Courtroom escort and witness accompaniment assigned for upcoming proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
