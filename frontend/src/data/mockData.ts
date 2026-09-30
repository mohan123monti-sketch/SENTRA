import { 
  VictimProfile, 
  CaseRecord, 
  CheckInRecord, 
  AlertItem, 
  InterventionRecord, 
  AppointmentRecord, 
  NotificationItem, 
  AuditLogEntry 
} from '../types/sentra';

export const INITIAL_VICTIM: VictimProfile = {
  id: "",
  name: "",
  pseudonym: "",
  gender: "",
  mail: "",
  mobileNumber: "",
  maskedMobile: "",
  location: "",
  district: "",
  state: "",
  relativeDetails: "",
  age: "",
  ageGroup: "",
  caseId: "",
  caseType: "",
  preferredLanguage: "en",
  consentStatus: {
    dataProcessing: true,
    voiceProcessing: true,
    counsellorContact: true,
    updatedAt: new Date().toISOString()
  },
  baseline: {
    emotionalWellbeing: 3,
    stressLevel: 3,
    sleepQuality: 3,
    concentrationScore: 3,
    productivityScore: 3,
    happinessScore: 3,
    engagementConsistency: 100
  },
  currentRisk: 'routine',
  assignedCounsellor: "",
  assignedOfficer: ""
};

export const INITIAL_CASES: CaseRecord[] = [];

export const INITIAL_CHECKINS: CheckInRecord[] = [];

export const INITIAL_ALERTS: AlertItem[] = [];

export const INITIAL_INTERVENTIONS: InterventionRecord[] = [];

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];

