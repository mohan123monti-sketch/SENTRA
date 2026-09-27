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

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: "CASE-2026-0819",
    caseNumber: "CC/2026/4102-S",
    victimId: "V-9042",
    category: "Domestic Harassment & Intimidation",
    stage: "investigation",
    filingDate: "2026-08-19",
    nextHearingDate: "2026-10-04",
    nextEventTitle: "Trial Examination",
    courtName: "Mahila Court, Chennai South",
    officialUpdates: [
      { date: "2026-08-19", stage: "complaint_registered", title: "FIR Registered", details: "Initial complaint logged." },
      { date: "2026-09-02", stage: "investigation", title: "Statements Recorded", details: "Section 164 statement filed." },
      { date: "2026-09-20", stage: "investigation", title: "Trial Scheduled", details: "Hearing scheduled for October." }
    ]
  }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: "CHK-1002",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    answers: {
      overallMood: 2, stressLevel: 5, sleepQuality: 1,
      concentrationScore: 2, productivityScore: 2, happinessScore: 2,
      physicalWellbeing: 2, eatingHabits: 2,
      feelsSafe: true, hasSupportToTalk: false, wantsCounsellorCall: true,
      freeTextNote: "I'm very anxious about the trial.", voiceRecorded: false
    },
    analysis: {
      distressIndicator: 85, sentimentScore: -0.7, primaryEmotions: ["anxiety", "fear"],
      baselineDelta: { distressDeltaPercent: 40, stressDelta: 2, sleepDelta: -2, engagementDrop: false },
      confidenceScore: 92, modelVersion: "2.4.1", whyFlagged: ["Severe stress", "Poor sleep"],
      featureAttributions: [], reviewRecommended: true
    }
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "ALT-789",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    victimPseudonym: "Priya S.",
    district: "Chennai South",
    severity: "priority_review",
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    title: "Spike in distress metrics",
    whyFlagged: ["High stress before trial", "Requested call"],
    confidence: 94,
    modelVersion: "2.4.1",
    status: "new"
  }
];

export const INITIAL_INTERVENTIONS: InterventionRecord[] = [
  {
    id: "INT-331",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    victimPseudonym: "Priya S.",
    createdAt: new Date().toISOString(),
    createdBy: "System",
    creatorRole: "Automated",
    type: "counselling_session",
    title: "Pre-Trial Desensitization",
    priority: "high",
    status: "scheduled",
    actionNotes: "Automatic scheduling based on recent distress indicator."
  }
];

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: "APP-551",
    victimId: "V-9042",
    counsellorName: "Dr. Ananya Raman",
    serviceType: "Virtual Therapy Session",
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    location: "Online Video Call",
    status: "confirmed"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-1",
    recipientRole: "victim",
    type: "checkin_reminder",
    title: "Daily Check-in Reminder",
    message: "Please complete your daily wellbeing check-in.",
    date: new Date().toISOString(),
    read: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-001",
    timestamp: new Date().toISOString(),
    actor: "System",
    actorRole: "Automated",
    action: "System Initialized",
    resource: "Platform Core",
    details: "Initialized secure database and cryptographic key storage.",
    ipMasked: "192.168.***.***"
  }
];
