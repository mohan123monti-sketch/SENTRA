export type UserRole = 
  | 'victim' 
  | 'counsellor' 
  | 'district_officer' 
  | 'legal_officer' 
  | 'state_admin' 
  | 'system_admin'
  | 'public';

export type CaseStage = 
  | 'complaint_registered' 
  | 'investigation' 
  | 'case_proceedings' 
  | 'trial' 
  | 'compensation_support' 
  | 'rehabilitation';

export type RiskSeverity = 'routine' | 'monitoring' | 'priority_review' | 'urgent_attention';

export type LanguageCode = 'en' | 'ta' | 'hi';

export interface ActiveUser {
  role: UserRole;
  name: string;
  id: string;
  badge?: string;
  designation?: string;
}

export interface VictimProfile {
  id: string; // Victim ID
  name: string; // Name
  pseudonym: string; // Pseudonym representation
  gender: string; // Gender
  mail: string; // Mail
  mobileNumber: string; // Mobile number
  maskedMobile: string; // Masked phone for public display
  location: string; // Location / Address
  district: string;
  state: string;
  relativeDetails: string; // Relative details
  age: string | number; // Age
  ageGroup: string;
  caseId: string; // Case ID
  caseType: string; // Case type
  preferredLanguage: LanguageCode; // Language
  consentStatus: {
    dataProcessing: boolean;
    voiceProcessing: boolean;
    counsellorContact: boolean;
    updatedAt: string;
  };
  baseline: {
    emotionalWellbeing: number; // 1-5 scale average
    stressLevel: number; // 1-5 scale average
    sleepQuality: number; // 1-5 scale average
    concentrationScore: number; // 1-5 scale average
    productivityScore: number; // 1-5 scale average
    happinessScore: number; // 1-5 scale average
    engagementConsistency: number; // 0-100%
  };
  currentRisk: RiskSeverity;
  assignedCounsellor: string;
  assignedOfficer: string;
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  victimId: string;
  category: string;
  stage: CaseStage;
  filingDate: string;
  nextHearingDate: string;
  nextEventTitle: string;
  courtName: string;
  officialUpdates: {
    date: string;
    stage: CaseStage;
    title: string;
    details: string;
  }[];
}

export interface CheckInQuestionAnswers {
  // The 10 Core Questions for Mental Health Scoring
  overallMood: number; // 1: Very Low, 2: Low, 3: Fair, 4: Good, 5: Very Good
  stressLevel: number; // 1: Minimal, 5: Overwhelming
  sleepQuality: number; // 1: Very Poor, 5: Restful
  concentrationScore: number; // 1: Very Poor, 5: Excellent
  productivityScore: number; // 1: Very Low, 5: Very High
  happinessScore: number; // 1: Very Unhappy, 5: Very Happy
  physicalWellbeing: number; // 1: Very Poor, 5: Excellent
  eatingHabits: number; // 1: Very Poor, 5: Normal
  feelsSafe: boolean; // 9th question
  wantsCounsellorCall: boolean; // 10th question
  
  hasSupportToTalk: boolean;
  freeTextNote?: string;
  voiceRecorded?: boolean;
  voiceTranscript?: string;
}

export interface AIAnalysisResult {
  checkInId?: string; // Persistent database record ID
  distressIndicator: number; // 0-100
  sentimentScore: number; // -1.0 to +1.0
  primaryEmotions: string[];
  acousticFeatures?: {
    pitchVariability: 'low' | 'moderate' | 'elevated';
    speechRate: 'slow' | 'standard' | 'rapid';
    energyLevel: 'depressed' | 'stable' | 'tense';
  };
  baselineDelta: {
    distressDeltaPercent: number; // e.g. +38%
    stressDelta: number;
    sleepDelta: number;
    engagementDrop: boolean;
  };
  confidenceScore: number; // 0-100%
  modelVersion: string;
  whyFlagged: string[];
  featureAttributions: {
    factor: string;
    impact: 'positive' | 'neutral' | 'elevated' | 'high_distress';
    description: string;
  }[];
  reviewRecommended: boolean;
}

export interface CheckInRecord {
  id: string;
  victimId: string;
  caseId: string;
  timestamp: string;
  answers: CheckInQuestionAnswers;
  analysis: AIAnalysisResult;
}

export interface AlertItem {
  id: string;
  victimId: string;
  caseId: string;
  victimPseudonym: string;
  district: string;
  severity: RiskSeverity;
  createdAt: string;
  title: string;
  whyFlagged: string[];
  confidence: number;
  modelVersion: string;
  status: 'new' | 'reviewed' | 'intervention_scheduled' | 'closed';
  counsellorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface InterventionRecord {
  id: string;
  victimId: string;
  caseId: string;
  victimPseudonym: string;
  createdAt: string;
  createdBy: string;
  creatorRole: string;
  type: 'counselling_session' | 'legal_aid_referral' | 'safety_review' | 'rehabilitation_grant' | 'welfare_check';
  title: string;
  priority: 'routine' | 'medium' | 'high' | 'immediate';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  actionNotes: string;
  outcome?: string;
}

export interface AppointmentRecord {
  id: string;
  victimId: string;
  counsellorName: string;
  serviceType: string;
  scheduledAt: string;
  location: string;
  status: 'confirmed' | 'pending' | 'rescheduled' | 'completed';
}

export interface NotificationItem {
  id: string;
  recipientRole: string;
  recipientId?: string;
  type: 'checkin_reminder' | 'appointment_reminder' | 'support_response' | 'case_update' | 'human_review_alert' | 'intervention_followup' | 'statutory_notice';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  details: string;
  ipMasked: string;
}
