import React from 'react';
import { AIAnalysisResult } from '../../types/sentra';
import { 
  AlertCircle, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';

interface ExplainableAICardProps {
  analysis: AIAnalysisResult;
  victimPseudonym?: string;
  showTechnicalMetrics?: boolean;
}

export const ExplainableAICard: React.FC<ExplainableAICardProps> = ({ 
  analysis, 
  victimPseudonym = "Complainant",
  showTechnicalMetrics = true 
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
      {/* Header & Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Explainable Decision Support
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              v{analysis.modelVersion}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
            <span>WHAT CHANGED?</span>
            <span className="text-xs font-normal text-slate-500">· Personal Baseline Comparison</span>
          </h3>
        </div>

        {/* Model Calibration Confidence */}
        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Model Confidence</div>
            <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              {analysis.confidenceScore}%
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-800">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Rationale Callout */}
      <div className="mt-4 bg-amber-50/70 border border-amber-200 rounded p-3.5">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Why was this flagged for human review?
            </h4>
            <p className="text-xs text-amber-950 mt-1 leading-relaxed">
              Compared with {victimPseudonym}'s historical 30-day baseline, the system detected a notable shift in self-reported indicators coupled with an imminent court date.
            </p>
          </div>
        </div>

        {/* Bulleted Rationale */}
        <ul className="mt-3 space-y-1.5 pl-6 list-disc text-xs text-amber-900">
          {analysis.whyFlagged.map((item, idx) => (
            <li key={idx} className="leading-snug">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Baseline Longitudinal Shift Deltas */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-500">Distress Shift</div>
          <div className="text-base font-bold text-rose-700 font-mono tabular-nums flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-4 h-4" />
            <span>+{analysis.baselineDelta.distressDeltaPercent}%</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">vs 30-day baseline</div>
        </div>

        <div className="p-3 rounded bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-500">Reported Stress</div>
          <div className="text-base font-bold text-amber-700 font-mono tabular-nums flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-4 h-4" />
            <span>+{analysis.baselineDelta.stressDelta} pts</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">on 1–5 scale</div>
        </div>

        <div className="p-3 rounded bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-500">Sleep Restfulness</div>
          <div className="text-base font-bold text-rose-700 font-mono tabular-nums flex items-center gap-1 mt-0.5">
            <TrendingDown className="w-4 h-4" />
            <span>{analysis.baselineDelta.sleepDelta} pts</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">sharp drop reported</div>
        </div>

        <div className="p-3 rounded bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-500">Sentiment Score</div>
          <div className="text-base font-bold text-slate-800 font-mono tabular-nums mt-0.5">
            {analysis.sentimentScore > 0 ? `+${analysis.sentimentScore}` : analysis.sentimentScore}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">valence range (-1 to +1)</div>
        </div>
      </div>

      {/* Feature Attribution Matrix */}
      {showTechnicalMetrics && analysis.featureAttributions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>Feature Attribution (SHAP / Multimodal Fusion Weights)</span>
          </h4>

          <div className="space-y-2">
            {analysis.featureAttributions.map((attr, i) => {
              const impactStyles = {
                high_distress: "bg-red-50 text-red-900 border-red-200",
                elevated: "bg-amber-50 text-amber-900 border-amber-200",
                neutral: "bg-slate-50 text-slate-700 border-slate-200",
                positive: "bg-emerald-50 text-emerald-900 border-emerald-200"
              }[attr.impact];

              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded border text-xs bg-white border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${impactStyles}`}>
                      {attr.impact.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-800">{attr.factor}</span>
                  </div>
                  <span className="text-slate-600 text-[11px]">{attr.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-Diagnostic Responsible AI Guarantee */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
        <UserCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-700">Strict Non-Diagnostic Guarantee:</strong> AI outputs are probabilistic decision-support signals designed to assist human professionals. SENTRA does not provide psychiatric diagnoses, clinical prescriptions, or automated legal remedies.
        </p>
      </div>
    </div>
  );
};
