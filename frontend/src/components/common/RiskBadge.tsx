import React from 'react';
import { RiskSeverity } from '../../types/sentra';
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  severity: RiskSeverity;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, size = 'md' }) => {
  const configs: Record<RiskSeverity, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    routine: {
      label: 'Routine Monitoring',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
    },
    monitoring: {
      label: 'Active Monitoring',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
    },
    priority_review: {
      label: 'Priority Human Review',
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-orange-700 shrink-0" />
    },
    urgent_attention: {
      label: 'Urgent Human Attention',
      bg: 'bg-red-50',
      text: 'text-red-900',
      border: 'border-red-200',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-red-700 shrink-0" />
    }
  };

  const config = configs[severity] || configs['routine'];
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3 py-1 font-semibold' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      role="status"
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
