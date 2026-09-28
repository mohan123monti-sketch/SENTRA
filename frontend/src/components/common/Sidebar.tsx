import React from 'react';
import { useSentra } from '../../context/SentraContext';
import { UserRole } from '../../types/sentra';
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Gamepad2, 
  FileText, 
  HeartHandshake, 
  Calendar, 
  Bell, 
  User, 
  Users, 
  AlertCircle, 
  Briefcase, 
  Activity, 
  BarChart3, 
  ShieldAlert, 
  FileCheck, 
  HelpCircle,
  Database,
  Settings,
  PhoneCall
} from 'lucide-react';
import { translations } from '../../utils/translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergencyModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenEmergencyModal }) => {
  const { role, notifications, language } = useSentra();
  const t = translations[language];

  const unreadVictimNotifs = notifications.filter(n => n.recipientRole === 'victim' && !n.read).length;
  const unreadStaffNotifs = notifications.filter(n => n.recipientRole === role && !n.read).length;

  const navLinksForRole = () => {
    switch (role) {
      case 'victim':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'checkin', label: 'Check-in', icon: <CheckSquare className="w-5 h-5" /> },
          { id: 'chatai', label: 'Chat AI', icon: <MessageSquare className="w-5 h-5" /> },
          { id: 'games', label: 'Calming Games', icon: <Gamepad2 className="w-5 h-5" /> },
          { id: 'case', label: 'My Case', icon: <FileText className="w-5 h-5" /> },
          { id: 'support', label: 'My Support', icon: <HeartHandshake className="w-5 h-5" /> },
          { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadVictimNotifs },
          { id: 'profile', label: 'My Profile & Details', icon: <User className="w-5 h-5" /> }
        ];
      case 'counsellor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'cases', label: 'Assigned Cases', icon: <Users className="w-5 h-5" /> },
          { id: 'alerts', label: 'Alerts', icon: <AlertCircle className="w-5 h-5" />, badge: unreadStaffNotifs },
          { id: 'casedetail', label: 'Case V-9042', icon: <FileText className="w-5 h-5" /> },
          { id: 'interventions', label: 'Interventions', icon: <Activity className="w-5 h-5" /> }
        ];
      case 'district_officer':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'priority_cases', label: 'Priority Cases', icon: <AlertCircle className="w-5 h-5" /> },
          { id: 'interventions', label: 'Interventions', icon: <Activity className="w-5 h-5" /> },
          { id: 'workload', label: 'Caseworker Load', icon: <Users className="w-5 h-5" /> },
          { id: 'analytics', label: 'District Analytics', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'reports', label: 'Official Reports', icon: <FileCheck className="w-5 h-5" /> }
        ];
      case 'legal_officer':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'safety_alerts', label: 'Safety & Protection', icon: <ShieldAlert className="w-5 h-5" /> },
          { id: 'cases', label: 'Proceedings Cases', icon: <Briefcase className="w-5 h-5" /> },
          { id: 'requests', label: 'Assistance Requests', icon: <HelpCircle className="w-5 h-5" /> },
          { id: 'followups', label: 'Legal Follow-ups', icon: <CheckSquare className="w-5 h-5" /> }
        ];
      case 'state_admin':
        return [
          { id: 'overview', label: 'Executive Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'analytics', label: 'State & District Analytics', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'trends', label: 'Longitudinal Trends', icon: <Activity className="w-5 h-5" /> },
          { id: 'interventions', label: 'Intervention Turnaround', icon: <CheckSquare className="w-5 h-5" /> },
          { id: 'reports', label: 'Parliamentary Reports', icon: <FileCheck className="w-5 h-5" /> }
        ];
      case 'system_admin':
        return [
          { id: 'overview', label: 'System Health', icon: <Activity className="w-5 h-5" /> },
          { id: 'users', label: 'User Directory', icon: <Users className="w-5 h-5" /> },
          { id: 'roles', label: 'RBAC Policy Matrix', icon: <ShieldAlert className="w-5 h-5" /> },
          { id: 'audit_logs', label: 'Audit Trail', icon: <Database className="w-5 h-5" /> },
          { id: 'configuration', label: 'Retention & Security', icon: <Settings className="w-5 h-5" /> },
          { id: 'ai_model', label: 'AI Model Registry', icon: <CheckSquare className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  const links = navLinksForRole();

  return (
    <aside className="w-64 bg-teal-800 border-r border-teal-700 text-teal-100 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-30">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        {links.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-900/50 text-white border border-teal-600/50 shadow-sm'
                  : 'hover:bg-teal-700 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-teal-300'}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}

        {role === 'victim' && onOpenEmergencyModal && (
          <div className="pt-6 mt-6 border-t border-teal-700">
            <button
              onClick={onOpenEmergencyModal}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold bg-white text-rose-600 hover:bg-rose-50 shadow-sm transition-colors"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t.emergencyTitle || 'I Need Help'}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
