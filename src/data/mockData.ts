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
  id: "V-9042",
  name: "Priya S.",
  pseudonym: "Priya S. (Demographic ID #9042)",
  gender: "Female",
  mail: "priya.s26@protection.justice.org",
  mobileNumber: "+91 98401 23814",
  maskedMobile: "+91 ••••• ••814",
  location: "14/B, 2nd Avenue, Adyar, Chennai South, Tamil Nadu - 600020",
  district: "Chennai South",
  state: "Tamil Nadu",
  relativeDetails: "Anitha S. (Elder Sister) — Contact: +91 98402 11982",
  age: "28",
  ageGroup: "25-34",
  caseId: "CASE-2026-0819",
  caseType: "Special Offence & Protection Against Intimidation",
  preferredLanguage: "en",
  consentStatus: {
    dataProcessing: true,
    voiceProcessing: true,
    counsellorContact: true,
    updatedAt: "2026-09-01T10:00:00Z"
  },
  baseline: {
    emotionalWellbeing: 3.8, // 1-5
    stressLevel: 2.1, // 1-5
    sleepQuality: 3.6, // 1-5
    engagementConsistency: 92 // %
  },
  currentRisk: 'priority_review',
  assignedCounsellor: "Dr. Ananya Raman (Senior Clinical Counsellor)",
  assignedOfficer: "Inspector M. Kumar (District Support Officer)"
};

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: "CASE-2026-0819",
    caseNumber: "CC/2026/0819-SPL",
    victimId: "V-9042",
    category: "Special Offence & Intimidation",
    stage: "trial",
    filingDate: "2026-03-12",
    nextHearingDate: "2026-10-04",
    nextEventTitle: "Trial Hearing & Cross-Examination",
    courtName: "City Sessions Court VIII",
    officialUpdates: [
      {
        date: "2026-09-20",
        stage: "trial",
        title: "Summons served for witness examination",
        details: "Hearing listed before Bench 3 on 04-Oct-2026 at 10:30 AM. Victim protection officer notified."
      },
      {
        date: "2026-07-15",
        stage: "case_proceedings",
        title: "Charges framed by Hon'ble Court",
        details: "Formal charges framed under Sections 354D, 506 IPC. Pre-trial readiness conference concluded."
      },
      {
        date: "2026-05-10",
        stage: "investigation",
        title: "Charge sheet filed by Investigating Officer",
        details: "Forensic evidence and certified statements compiled and admitted."
      },
      {
        date: "2026-03-12",
        stage: "complaint_registered",
        title: "First Information Report Registered",
        details: "Complaint assigned to Special Cell. Dedicated support liaison assigned."
      }
    ]
  },
  {
    id: "CASE-2026-1102",
    caseNumber: "SC/2026/1102-GEN",
    victimId: "V-7821",
    category: "Economic Coercion & Domestic Harassment",
    stage: "investigation",
    filingDate: "2026-07-28",
    nextHearingDate: "2026-10-18",
    nextEventTitle: "Investigative Status Review",
    courtName: "Metropolitan Magistrate Court IV",
    officialUpdates: [
      {
        date: "2026-08-14",
        stage: "investigation",
        title: "Financial audit inquiry initiated",
        details: "Bank records requisitioned under section 91 CrPC."
      }
    ]
  },
  {
    id: "CASE-2026-0422",
    caseNumber: "CC/2025/0422-REH",
    victimId: "V-6510",
    category: "Aggravated Assault",
    stage: "compensation_support",
    filingDate: "2025-11-04",
    nextHearingDate: "2026-10-25",
    nextEventTitle: "Victim Compensation Sanction Committee",
    courtName: "District Legal Services Authority",
    officialUpdates: [
      {
        date: "2026-09-02",
        stage: "compensation_support",
        title: "Interim compensation disbursed",
        details: "Direct bank transfer of approved interim relief credited to beneficiary."
      }
    ]
  }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: "CHK-01",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    timestamp: "2026-09-12T09:30:00Z",
    answers: {
      overallMood: 4,
      stressLevel: 2,
      sleepQuality: 4,
      feelsSafe: true,
      hasSupportToTalk: true,
      wantsCounsellorCall: false,
      freeTextNote: "Feeling okay this week. Routine daily schedule is going well."
    },
    analysis: {
      distressIndicator: 22,
      sentimentScore: 0.52,
      primaryEmotions: ["Calm", "Relieved"],
      baselineDelta: {
        distressDeltaPercent: -4,
        stressDelta: -0.1,
        sleepDelta: +0.4,
        engagementDrop: false
      },
      confidenceScore: 91,
      modelVersion: "v2.4.1",
      whyFlagged: [],
      featureAttributions: [
        { factor: "Routine Sentiment", impact: "positive", description: "Positive emotional valence detected in text and mood rating" }
      ],
      reviewRecommended: false
    }
  },
  {
    id: "CHK-02",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    timestamp: "2026-09-19T14:15:00Z",
    answers: {
      overallMood: 3,
      stressLevel: 3,
      sleepQuality: 3,
      feelsSafe: true,
      hasSupportToTalk: true,
      wantsCounsellorCall: false,
      freeTextNote: "A bit uneasy thinking about next month, but managing."
    },
    analysis: {
      distressIndicator: 38,
      sentimentScore: 0.10,
      primaryEmotions: ["Mild Apprehension"],
      baselineDelta: {
        distressDeltaPercent: +14,
        stressDelta: +0.9,
        sleepDelta: -0.6,
        engagementDrop: false
      },
      confidenceScore: 88,
      modelVersion: "v2.4.1",
      whyFlagged: ["Mild deviation from personal stress baseline"],
      featureAttributions: [
        { factor: "Anticipatory Anxiety", impact: "elevated", description: "Text analysis noted mild apprehension about upcoming schedule" }
      ],
      reviewRecommended: false
    }
  },
  {
    id: "CHK-03",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    timestamp: "2026-09-25T19:40:00Z",
    answers: {
      overallMood: 1,
      stressLevel: 5,
      sleepQuality: 1,
      feelsSafe: false,
      hasSupportToTalk: false,
      wantsCounsellorCall: true,
      freeTextNote: "I received the formal trial summons for October 4th. I haven't slept in three nights and I feel terrifyingly alone facing the court cross-examination.",
      voiceRecorded: true,
      voiceTranscript: "I'm really scared about next Friday. Every time my phone rings my chest tightens."
    },
    analysis: {
      distressIndicator: 78,
      sentimentScore: -0.74,
      primaryEmotions: ["Acute Fear", "Helplessness", "Severe Stress"],
      acousticFeatures: {
        pitchVariability: 'low',
        speechRate: 'slow',
        energyLevel: 'tense'
      },
      baselineDelta: {
        distressDeltaPercent: +62,
        stressDelta: +2.9,
        sleepDelta: -2.6,
        engagementDrop: false
      },
      confidenceScore: 94,
      modelVersion: "v2.4.1",
      whyFlagged: [
        "Distress indicator increased by +62% over personal baseline",
        "Reported feeling unsafe and lacking conversational support",
        "Acoustic markers show elevated vocal tension and low pitch variability",
        "Upcoming high-stress case event detected (Trial examination in 9 days)",
        "Explicit affirmative request for counsellor contact"
      ],
      featureAttributions: [
        { factor: "Situational Trial Stressor", impact: "high_distress", description: "Proximity to high-stakes cross-examination hearing on 04-Oct" },
        { factor: "Sleep Disruption", impact: "high_distress", description: "Reported 3 consecutive days of acute sleep deprivation (Rating 1/5)" },
        { factor: "Safety Concern Signal", impact: "high_distress", description: "Direct response indicating lack of safety in current setting" },
        { factor: "Vocal Acoustic Energy", impact: "elevated", description: "Flattened acoustic profile characteristic of acute somatic tension" }
      ],
      reviewRecommended: true
    }
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "ALT-2026-041",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    victimPseudonym: "Priya S. (V-9042)",
    district: "Chennai South",
    severity: "priority_review",
    createdAt: "2026-09-25T19:42:00Z",
    title: "Acute distress escalation ahead of trial cross-examination",
    whyFlagged: [
      "Distress indicator increased +62% compared to personal baseline",
      "Subject reported feeling unsafe and requested counsellor support",
      "Upcoming trial hearing scheduled in 9 days (04-Oct-2026)",
      "Multi-modal voice acoustic markers show elevated vocal tension"
    ],
    confidence: 94,
    modelVersion: "v2.4.1",
    status: "new"
  },
  {
    id: "ALT-2026-039",
    victimId: "V-7821",
    caseId: "CASE-2026-1102",
    victimPseudonym: "Kavita N. (V-7821)",
    district: "Salem North",
    severity: "monitoring",
    createdAt: "2026-09-24T11:20:00Z",
    title: "Check-in cadence lapse beyond baseline threshold",
    whyFlagged: [
      "Engagement gap: missed two regular weekly check-ins",
      "Prior check-in showed moderate financial anxiety"
    ],
    confidence: 81,
    modelVersion: "v2.4.1",
    status: "reviewed",
    counsellorNotes: "Sent gentle SMS reminder via authorized gateway. Complainant confirmed busy with work schedule.",
    reviewedBy: "Dr. Ananya Raman",
    reviewedAt: "2026-09-24T15:00:00Z"
  },
  {
    id: "ALT-2026-035",
    victimId: "V-6510",
    caseId: "CASE-2026-0422",
    victimPseudonym: "Farida B. (V-6510)",
    district: "Madurai Urban",
    severity: "routine",
    createdAt: "2026-09-23T08:15:00Z",
    title: "Post-compensation stability confirmed",
    whyFlagged: [
      "Well-being metrics returned to pre-incident baseline level (+5%)"
    ],
    confidence: 90,
    modelVersion: "v2.4.1",
    status: "closed",
    counsellorNotes: "Rehabilitation disbursement confirmed. Case in routine follow-up.",
    reviewedBy: "Dr. K. Swaminathan",
    reviewedAt: "2026-09-23T10:30:00Z"
  }
];

export const INITIAL_INTERVENTIONS: InterventionRecord[] = [
  {
    id: "INT-2026-088",
    victimId: "V-9042",
    caseId: "CASE-2026-0819",
    victimPseudonym: "Priya S. (V-9042)",
    createdAt: "2026-09-25T20:10:00Z",
    createdBy: "Dr. Ananya Raman",
    creatorRole: "Counsellor",
    type: "counselling_session",
    title: "Pre-Trial Desensitization & Witness Support Session",
    priority: "high",
    status: "scheduled",
    actionNotes: "Scheduled one-on-one trauma-informed pre-trial preparation call. Requested Protection Officer accompany victim during entry to Sessions Court."
  },
  {
    id: "INT-2026-082",
    victimId: "V-6510",
    caseId: "CASE-2026-0422",
    victimPseudonym: "Farida B. (V-6510)",
    createdAt: "2026-09-02T11:00:00Z",
    createdBy: "S. Rajendran",
    creatorRole: "District Case Officer",
    type: "rehabilitation_grant",
    title: "District Legal Services Interim Grant Coordination",
    priority: "routine",
    status: "completed",
    actionNotes: "Coordinated with DLSA Member Secretary. Interim compensation fund approved and released.",
    outcome: "Relief successfully credited to beneficiary bank account."
  }
];

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: "APT-2026-104",
    victimId: "V-9042",
    counsellorName: "Dr. Ananya Raman (Senior Clinical Counsellor)",
    serviceType: "Pre-Trial Psychological Support & Coping Consultation",
    scheduledAt: "2026-09-28T11:00:00",
    location: "Secure Telehealth Session (Authorized Portal Link)",
    status: "confirmed"
  },
  {
    id: "APT-2026-098",
    victimId: "V-9042",
    counsellorName: "Adv. S. Lakshmi (DLSA Legal Aid Counsel)",
    serviceType: "Courtroom Familiarization & Witness Rights Briefing",
    scheduledAt: "2026-10-01T15:30:00",
    location: "District Court Legal Assistance Center, Room 14",
    status: "confirmed"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-01",
    recipientRole: "victim",
    recipientId: "V-9042",
    type: "appointment_reminder",
    title: "Upcoming Support Session Confirmed",
    message: "Your pre-trial consultation with Dr. Ananya Raman is scheduled for 28-Sep-2026 at 11:00 AM.",
    date: "2026-09-25T20:15:00Z",
    read: false
  },
  {
    id: "NOTIF-02",
    recipientRole: "victim",
    recipientId: "V-9042",
    type: "case_update",
    title: "Official Case Listing Notice",
    message: "Trial proceedings in CC/2026/0819-SPL listed for 04-Oct-2026 before Court VIII.",
    date: "2026-09-20T10:00:00Z",
    read: true
  },
  {
    id: "NOTIF-03",
    recipientRole: "counsellor",
    type: "human_review_alert",
    title: "Priority Review: Case V-9042",
    message: "Sudden distress elevation (+62%) logged ahead of scheduled trial hearing on 04-Oct.",
    date: "2026-09-25T19:42:00Z",
    read: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-8901",
    timestamp: "2026-09-25T20:10:22Z",
    actor: "ananya.raman@counsellor.sentra.gov",
    actorRole: "Counsellor",
    action: "CREATE_INTERVENTION",
    resource: "INT-2026-088",
    details: "Created Pre-Trial Desensitization session for case CASE-2026-0819 (Victim V-9042)",
    ipMasked: "10.42.19.***"
  },
  {
    id: "AUD-8900",
    timestamp: "2026-09-25T19:42:01Z",
    actor: "sentra-inference-engine",
    actorRole: "System Worker",
    action: "GENERATE_AI_RISK_ALERT",
    resource: "ALT-2026-041",
    details: "Distress threshold exceeded baseline by >50%. Explainable alert generated for human review.",
    ipMasked: "127.0.0.1"
  },
  {
    id: "AUD-8899",
    timestamp: "2026-09-25T19:40:48Z",
    actor: "V-9042 (Authenticated Victim)",
    actorRole: "Victim",
    action: "SUBMIT_CHECKIN",
    resource: "CHK-03",
    details: "Completed check-in with optional audio segment. Encrypted at rest.",
    ipMasked: "106.198.88.***"
  },
  {
    id: "AUD-8898",
    timestamp: "2026-09-24T15:00:10Z",
    actor: "ananya.raman@counsellor.sentra.gov",
    actorRole: "Counsellor",
    action: "REVIEW_ALERT",
    resource: "ALT-2026-039",
    details: "Marked alert as reviewed with professional observation note.",
    ipMasked: "10.42.19.***"
  },
  {
    id: "AUD-8897",
    timestamp: "2026-09-01T10:00:00Z",
    actor: "V-9042 (Authenticated Victim)",
    actorRole: "Victim",
    action: "CONSENT_RECORDED",
    resource: "CONSENT-V-9042",
    details: "Explicit consent verified for well-being monitoring and support outreach.",
    ipMasked: "106.198.88.***"
  }
];
