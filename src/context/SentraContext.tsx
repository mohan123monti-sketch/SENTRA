import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  LanguageCode,
  VictimProfile,
  CaseRecord,
  CheckInRecord,
  CheckInQuestionAnswers,
  AIAnalysisResult,
  AlertItem,
  InterventionRecord,
  AppointmentRecord,
  NotificationItem,
  AuditLogEntry,
  RiskSeverity
} from '../types/sentra';
import {
  INITIAL_VICTIM,
  INITIAL_CASES,
  INITIAL_CHECKINS,
  INITIAL_ALERTS,
  INITIAL_INTERVENTIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import {
  saveCheckInToDB,
  getCheckInsFromDB,
  purgeCheckInsFromDB,
  saveVictimProfileToDB,
  getVictimProfileFromDB,
  saveAuditLogToDB
} from '../services/db';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
}

interface SentraContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isVictimAuthenticated: boolean;
  setIsVictimAuthenticated: (auth: boolean) => void;
  isAuthenticated: boolean;
  activeUser: import('../types/sentra').ActiveUser | null;
  loginAsVictim: () => void;
  loginAsStaff: (staffRole: UserRole, staffName?: string, staffId?: string, designation?: string) => void;
  logout: () => void;
  victim: VictimProfile;
  cases: CaseRecord[];
  checkIns: CheckInRecord[];
  alerts: AlertItem[];
  interventions: InterventionRecord[];
  appointments: AppointmentRecord[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  
  // Workflow actions
  submitCheckIn: (answers: CheckInQuestionAnswers) => AIAnalysisResult;
  reviewAlert: (alertId: string, notes: string, action: 'confirm' | 'followup' | 'escalate' | 'closed') => void;
  createIntervention: (data: Omit<InterventionRecord, 'id' | 'createdAt'>, scheduleAppointment?: boolean) => void;
  confirmAppointment: (appointmentId: string) => void;
  requestRescheduleAppointment: (appointmentId: string) => void;
  updateConsent: (settings: { dataProcessing: boolean; voiceProcessing: boolean; counsellorContact: boolean }) => void;
  updateVictimProfile: (data: Partial<VictimProfile>) => void;
  requestDataRetentionReview: (reason: string, purgeNonJudicialHistory: boolean, withdrawOptionalConsents: boolean) => string;
  markNotificationAsRead: (id: string) => void;
  resetDemoData: () => void;
}

const SentraContext = createContext<SentraContextType | undefined>(undefined);

export const SentraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('public');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isVictimAuthenticated, setIsVictimAuthenticated] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<import('../types/sentra').ActiveUser | null>(null);
  
  const [victim, setVictim] = useState<VictimProfile>(INITIAL_VICTIM);
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(INITIAL_CHECKINS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [interventions, setInterventions] = useState<InterventionRecord[]>(INITIAL_INTERVENTIONS);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Persistent Client Database Hydration (IndexedDB + LocalStorage)
  useEffect(() => {
    getCheckInsFromDB().then(dbCheckIns => {
      if (dbCheckIns && dbCheckIns.length > 0) {
        setCheckIns(prev => {
          const ids = new Set(dbCheckIns.map(c => c.id));
          const uniqueExisting = prev.filter(c => !ids.has(c.id));
          return [...dbCheckIns, ...uniqueExisting];
        });
      }
    }).catch(err => console.warn('Could not hydrate checkins from DB:', err));

    getVictimProfileFromDB('V-9042').then(savedVictim => {
      if (savedVictim) {
        setVictim(savedVictim);
      }
    }).catch(err => console.warn('Could not hydrate victim profile from DB:', err));
  }, []);

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
  });

  const loginAsVictim = () => {
    setIsAuthenticated(true);
    setIsVictimAuthenticated(true);
    setRole('victim');
    setActiveUser({
      role: 'victim',
      name: victim.name || victim.pseudonym,
      id: victim.id,
      badge: victim.caseId,
      designation: 'Registered Complainant'
    });

    const timestamp = new Date().toISOString();
    const loginAudit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      actor: `${victim.id} (Victim OTP Session)`,
      actorRole: 'Victim',
      action: 'VICTIM_OTP_LOGIN',
      resource: `PORTAL-${victim.id}`,
      details: 'Secure OTP authentication verified for victim well-being portal.',
      ipMasked: '106.198.88.***'
    };
    setAuditLogs(prev => [loginAudit, ...prev]);
  };

  const loginAsStaff = (
    staffRole: UserRole,
    staffName?: string,
    staffId?: string,
    designation?: string
  ) => {
    const defaultStaffProfiles: Record<string, { name: string; id: string; designation: string }> = {
      counsellor: {
        name: "Dr. Ananya Raman",
        id: "DLSA-TN-408",
        designation: "Senior Clinical Counsellor"
      },
      district_officer: {
        name: "Inspector M. Kumar",
        id: "TN-POL-CH-882",
        designation: "District Support & Case Officer"
      },
      legal_officer: {
        name: "Adv. Rajeshwari Sen",
        id: "DLSA-LEG-091",
        designation: "Legal & Protection Officer"
      },
      state_admin: {
        name: "Dr. S. Meenakshi, IAS",
        id: "TN-DIR-SD-004",
        designation: "Directorate of Social Defence"
      },
      system_admin: {
        name: "Security Officer A. Verma",
        id: "SENTRA-SYS-01",
        designation: "Cyber Governance & Audit"
      }
    };

    const profile = defaultStaffProfiles[staffRole] || {
      name: staffName || "Authorized Official",
      id: staffId || "STAFF-AUTH",
      designation: designation || "Case Officer"
    };

    setIsAuthenticated(true);
    setIsVictimAuthenticated(false);
    setRole(staffRole);
    setActiveUser({
      role: staffRole,
      name: staffName || profile.name,
      id: staffId || profile.id,
      badge: profile.id,
      designation: designation || profile.designation
    });

    const timestamp = new Date().toISOString();
    const loginAudit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      actor: `${staffId || profile.id} (${staffName || profile.name})`,
      actorRole: staffRole,
      action: 'OFFICER_CREDENTIAL_LOGIN',
      resource: `SYSTEM-${staffRole.toUpperCase()}`,
      details: `Authorized public servant 2FA authentication verified for role: ${staffRole}.`,
      ipMasked: '10.42.19.***'
    };
    setAuditLogs(prev => [loginAudit, ...prev]);
  };

  const logout = () => {
    const timestamp = new Date().toISOString();
    if (activeUser) {
      const logoutAudit: AuditLogEntry = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp,
        actor: `${activeUser.id} (${activeUser.name})`,
        actorRole: activeUser.role,
        action: 'USER_LOGOUT',
        resource: 'AUTH_SESSION',
        details: 'User explicitly terminated session and signed out.',
        ipMasked: '10.42.19.***'
      };
      setAuditLogs(prev => [logoutAudit, ...prev]);
    }

    setIsAuthenticated(false);
    setIsVictimAuthenticated(false);
    setActiveUser(null);
    setRole('public');
  };

  // Apply accessibility settings to HTML root
  useEffect(() => {
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (accessibility.largeText) {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.remove('text-lg');
    }
  }, [accessibility]);

  // AI Feature Fusion & Baseline Comparison Engine
  const submitCheckIn = (answers: CheckInQuestionAnswers): AIAnalysisResult => {
    const timestamp = new Date().toISOString();
    
    // 1. Compute Distress Components based on check-in responses
    // Mood: 1 (Very Low) -> 5 (Very Good). Invert: (5 - Mood) * 15 (max 60)
    const moodDistress = (5 - answers.overallMood) * 12; 
    // Stress: 1 -> 5. Score: (Stress - 1) * 10 (max 40)
    const stressDistress = (answers.stressLevel - 1) * 8;
    // Sleep: 1 -> 5. Invert: (5 - Sleep) * 6 (max 24)
    const sleepDistress = (5 - answers.sleepQuality) * 5;
    // Safety flag: if false, substantial risk weight (+25)
    const safetyPenalty = !answers.feelsSafe ? 25 : 0;
    // Support flag: if false (+10)
    const isolationPenalty = !answers.hasSupportToTalk ? 10 : 0;
    // Direct request: (+10)
    const requestWeight = answers.wantsCounsellorCall ? 10 : 0;

    let rawScore = moodDistress + stressDistress + sleepDistress + safetyPenalty + isolationPenalty + requestWeight;
    const distressIndicator = Math.min(98, Math.max(8, Math.round(rawScore * 0.72)));

    // Sentiment calculation from free-text and ratings
    let sentiment = (answers.overallMood - 3) / 2; // -1.0 to 1.0 base
    if (answers.freeTextNote) {
      const lower = answers.freeTextNote.toLowerCase();
      if (lower.includes('fear') || lower.includes('terrified') || lower.includes('panic') || lower.includes('alone') || lower.includes('scared') || lower.includes('cannot sleep')) {
        sentiment = Math.max(-0.95, sentiment - 0.4);
      } else if (lower.includes('better') || lower.includes('calm') || lower.includes('peace') || lower.includes('thank')) {
        sentiment = Math.min(0.9, sentiment + 0.3);
      }
    }

    // Baseline delta comparison
    const baseDistress = (5 - victim.baseline.emotionalWellbeing) * 12 + (victim.baseline.stressLevel - 1) * 8;
    const deltaPercent = Math.round(((rawScore - baseDistress) / Math.max(10, baseDistress)) * 100);
    const stressDelta = Number((answers.stressLevel - victim.baseline.stressLevel).toFixed(1));
    const sleepDelta = Number((answers.sleepQuality - victim.baseline.sleepQuality).toFixed(1));

    // Determine why flagged & feature attributions
    const whyFlagged: string[] = [];
    const featureAttributions: AIAnalysisResult['featureAttributions'] = [];

    if (deltaPercent > 25) {
      whyFlagged.push(`Distress indicator shifted +${deltaPercent}% above personal baseline`);
      featureAttributions.push({
        factor: 'Baseline Shift',
        impact: deltaPercent > 45 ? 'high_distress' : 'elevated',
        description: `Acute variance detected compared to historical 30-day baseline metrics`
      });
    }

    if (!answers.feelsSafe) {
      whyFlagged.push('Complainant reported feeling unsafe in their current situation');
      featureAttributions.push({
        factor: 'Safety Concern',
        impact: 'high_distress',
        description: 'Negative affirmation on direct safety inquiry'
      });
    }

    if (answers.sleepQuality <= 2) {
      whyFlagged.push('Marked sleep disturbance reported over multiple days');
      featureAttributions.push({
        factor: 'Sleep Disturbance',
        impact: 'elevated',
        description: `Sleep restfulness rated at ${answers.sleepQuality}/5`
      });
    }

    if (answers.wantsCounsellorCall) {
      whyFlagged.push('Direct request for counsellor support recorded in check-in');
      featureAttributions.push({
        factor: 'Direct Support Request',
        impact: 'elevated',
        description: 'Explicit request for human consultation logged'
      });
    }

    if (answers.voiceRecorded) {
      featureAttributions.push({
        factor: 'Vocal Acoustic Analysis',
        impact: rawScore > 50 ? 'elevated' : 'neutral',
        description: 'Acoustic prosody analysis detected cadence variation and tension indicators'
      });
    }

    // Proximity to case hearing
    whyFlagged.push('Approaching case proceeding milestone (Trial Examination on 04-Oct-2026)');
    featureAttributions.push({
      factor: 'Case-Stage Proximity',
      impact: 'elevated',
      description: 'System correlates distress escalation with imminent court cross-examination'
    });

    const primaryEmotions: string[] = [];
    if (distressIndicator > 65) {
      primaryEmotions.push('Acute Situational Distress', 'Apprehension');
      if (!answers.feelsSafe) primaryEmotions.push('Safety Concern');
    } else if (distressIndicator > 35) {
      primaryEmotions.push('Moderate Stress', 'Vigilance');
    } else {
      primaryEmotions.push('Calm', 'Stable Routine');
    }

    const reviewRecommended = distressIndicator >= 45 || !answers.feelsSafe || answers.wantsCounsellorCall;

    const analysis: AIAnalysisResult = {
      distressIndicator,
      sentimentScore: Number(sentiment.toFixed(2)),
      primaryEmotions,
      acousticFeatures: answers.voiceRecorded ? {
        pitchVariability: distressIndicator > 60 ? 'low' : 'moderate',
        speechRate: distressIndicator > 60 ? 'slow' : 'standard',
        energyLevel: distressIndicator > 60 ? 'tense' : 'stable'
      } : undefined,
      baselineDelta: {
        distressDeltaPercent: deltaPercent,
        stressDelta,
        sleepDelta,
        engagementDrop: false
      },
      confidenceScore: 92,
      modelVersion: 'v2.4.1',
      whyFlagged,
      featureAttributions,
      reviewRecommended
    };

    // Determine new risk state
    let newRisk: RiskSeverity = 'routine';
    if (distressIndicator >= 70 || !answers.feelsSafe) {
      newRisk = 'priority_review';
    } else if (distressIndicator >= 40 || reviewRecommended) {
      newRisk = 'monitoring';
    }

    const newCheckInId = `CHK-${Date.now().toString().slice(-4)}`;
    analysis.checkInId = newCheckInId;

    // Save check-in record
    const newCheckIn: CheckInRecord = {
      id: newCheckInId,
      victimId: victim.id,
      caseId: victim.caseId,
      timestamp,
      answers,
      analysis
    };

    setCheckIns(prev => [newCheckIn, ...prev]);
    saveCheckInToDB(newCheckIn).catch(e => console.error('Database write error:', e));
    setVictim(prev => ({
      ...prev,
      currentRisk: newRisk
    }));

    // If review recommended, trigger or update alert for authorized caseworkers
    if (reviewRecommended) {
      const newAlert: AlertItem = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        victimId: victim.id,
        caseId: victim.caseId,
        victimPseudonym: victim.pseudonym,
        district: victim.district,
        severity: newRisk,
        createdAt: timestamp,
        title: !answers.feelsSafe 
          ? 'Safety concern & acute distress logged in latest check-in'
          : `Well-being indicator elevation (+${deltaPercent}% baseline shift)`,
        whyFlagged: analysis.whyFlagged,
        confidence: analysis.confidenceScore,
        modelVersion: analysis.modelVersion,
        status: 'new'
      };

      setAlerts(prev => [newAlert, ...prev]);

      // Create caseworker notification
      const caseworkerNotif: NotificationItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        recipientRole: 'counsellor',
        type: 'human_review_alert',
        title: `Priority Review Flagged: ${victim.pseudonym}`,
        message: `Distress indicator ${distressIndicator}/100 with baseline shift (+${deltaPercent}%). Human review requested.`,
        date: timestamp,
        read: false
      };
      setNotifications(prev => [caseworkerNotif, ...prev]);
    }

    // Log to immutable Audit Log
    const newAudit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      actor: `${victim.id} (Authenticated Victim)`,
      actorRole: 'Victim',
      action: 'SUBMIT_CHECKIN',
      resource: newCheckIn.id,
      details: `Completed check-in. AI calculated distress: ${distressIndicator}. Review recommended: ${reviewRecommended}.`,
      ipMasked: '106.198.88.***'
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    return analysis;
  };

  // Counsellor / Human Review Action
  const reviewAlert = (alertId: string, notes: string, action: 'confirm' | 'followup' | 'escalate' | 'closed') => {
    const timestamp = new Date().toISOString();
    
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: action === 'closed' ? 'closed' : 'reviewed',
          counsellorNotes: notes,
          reviewedBy: 'Dr. Ananya Raman (Senior Clinical Counsellor)',
          reviewedAt: timestamp
        };
      }
      return a;
    }));

    // Audit log
    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      actor: 'ananya.raman@counsellor.sentra.gov',
      actorRole: 'Counsellor',
      action: 'HUMAN_REVIEW_RECORDED',
      resource: alertId,
      details: `Counsellor evaluated alert with decision: ${action.toUpperCase()}. Clinical notes added.`,
      ipMasked: '10.42.19.***'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // Intervention Creation
  const createIntervention = (
    data: Omit<InterventionRecord, 'id' | 'createdAt'>,
    scheduleAppointment = true
  ) => {
    const timestamp = new Date().toISOString();
    const newId = `INT-${Date.now().toString().slice(-4)}`;
    
    const newIntervention: InterventionRecord = {
      ...data,
      id: newId,
      createdAt: timestamp
    };

    setInterventions(prev => [newIntervention, ...prev]);

    // If intervention schedules an appointment, add to Appointments table
    if (scheduleAppointment) {
      const newAppt: AppointmentRecord = {
        id: `APT-${Date.now().toString().slice(-4)}`,
        victimId: data.victimId,
        counsellorName: data.createdBy,
        serviceType: data.title,
        scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), // 2 days from now
        location: 'Secure Telehealth Portal (SENTRA Encrypted Room)',
        status: 'confirmed'
      };
      setAppointments(prev => [newAppt, ...prev]);

      // Notify victim
      const victimNotif: NotificationItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        recipientRole: 'victim',
        recipientId: data.victimId,
        type: 'appointment_reminder',
        title: 'New Support Appointment Scheduled',
        message: `Your caseworker has scheduled "${data.title}" for your support journey.`,
        date: timestamp,
        read: false
      };
      setNotifications(prev => [victimNotif, ...prev]);
    }

    // Audit log
    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      actor: data.createdBy,
      actorRole: data.creatorRole,
      action: 'CREATE_INTERVENTION',
      resource: newId,
      details: `Created intervention plan: ${data.title} (${data.type})`,
      ipMasked: '10.42.19.***'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const confirmAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'confirmed' };
      }
      return apt;
    }));

    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: `${victim.id} (Authenticated Victim)`,
      actorRole: 'Victim',
      action: 'CONFIRM_APPOINTMENT',
      resource: appointmentId,
      details: 'Confirmed attendance for upcoming support appointment.',
      ipMasked: '106.198.88.***'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const requestRescheduleAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'rescheduled' };
      }
      return apt;
    }));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      recipientRole: 'counsellor',
      type: 'appointment_reminder',
      title: 'Reschedule Request Received',
      message: `Complainant requested a reschedule for appointment ${appointmentId}.`,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateConsent = (settings: { dataProcessing: boolean; voiceProcessing: boolean; counsellorContact: boolean }) => {
    setVictim(prev => ({
      ...prev,
      consentStatus: {
        ...settings,
        updatedAt: new Date().toISOString()
      }
    }));

    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: `${victim.id} (Authenticated Victim)`,
      actorRole: 'Victim',
      action: 'UPDATE_CONSENT',
      resource: `CONSENT-${victim.id}`,
      details: `Updated privacy consents: Voice=${settings.voiceProcessing}, Contact=${settings.counsellorContact}`,
      ipMasked: '106.198.88.***'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const updateVictimProfile = (updated: Partial<VictimProfile>) => {
    setVictim(prev => {
      const merged: VictimProfile = { ...prev, ...updated };
      if (updated.mobileNumber && updated.mobileNumber !== prev.mobileNumber) {
        const lastDigits = updated.mobileNumber.replace(/\D/g, '').slice(-4) || '814';
        merged.maskedMobile = `+91 ••••• ••${lastDigits}`;
      }
      saveVictimProfileToDB(merged).catch(e => console.error('Database victim profile error:', e));
      return merged;
    });

    // If preferred language changed, synchronize platform language
    if (updated.preferredLanguage) {
      setLanguage(updated.preferredLanguage);
    }

    // If active user is victim, synchronize active user state
    if (activeUser && activeUser.role === 'victim') {
      setActiveUser(prev => prev ? ({
        ...prev,
        name: updated.name || prev.name,
        id: updated.id || prev.id,
        badge: updated.caseId || prev.badge
      }) : null);
    }

    // Synchronize cases list if caseId or caseType changed
    if (updated.caseId || updated.caseType || updated.id) {
      setCases(prev => prev.map(c => {
        if (c.id === victim.caseId || c.victimId === victim.id) {
          return {
            ...c,
            id: updated.caseId || c.id,
            category: updated.caseType || c.category,
            victimId: updated.id || c.victimId
          };
        }
        return c;
      }));
    }

    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: `${updated.id || victim.id} (${updated.name || victim.name})`,
      actorRole: 'Victim',
      action: 'VICTIM_PROFILE_UPDATED',
      resource: `PROFILE-${updated.id || victim.id}`,
      details: `Victim updated profile data: Name, Gender, Mail, Mobile, Location, Relative, Age, Victim ID, Case ID, Language, Case Type.`,
      ipMasked: '106.198.88.***'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const requestDataRetentionReview = (
    reason: string, 
    purgeNonJudicialHistory: boolean, 
    withdrawOptionalConsents: boolean
  ): string => {
    const referenceNumber = `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    if (withdrawOptionalConsents) {
      setVictim(prev => ({
        ...prev,
        consentStatus: {
          ...prev.consentStatus,
          voiceProcessing: false,
          counsellorContact: false,
          updatedAt: timestamp
        }
      }));
    }

    if (purgeNonJudicialHistory) {
      // Keep only statutory baseline and clear voluntary routine checkins
      setCheckIns(prev => prev.slice(0, 1));
      purgeCheckInsFromDB(victim.id).catch(e => console.error('Database purge error:', e));
    }

    // Complainant notification
    const victimNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      recipientRole: 'victim',
      type: 'statutory_notice',
      title: `Data Retention Review Lodged: ${referenceNumber}`,
      message: `Your statutory request (${referenceNumber}) has been submitted for DLSA compliance review. Assigned review window: 48 business hours.`,
      date: timestamp,
      read: false
    };

    // District officer alert
    const staffNotif: NotificationItem = {
      id: `NOTIF-${(Date.now() + 1).toString().slice(-4)}`,
      recipientRole: 'district_officer',
      type: 'statutory_notice',
      title: `Data Rights Review Filed: ${victim.id}`,
      message: `Complainant ${victim.id} (${victim.name}) filed statutory data retention review (${referenceNumber}): "${reason}". Statutory 48h SLA triggered.`,
      date: timestamp,
      read: false
    };

    setNotifications(prev => [victimNotif, staffNotif, ...prev]);

    // Audit trail logging
    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      actor: `${victim.id} (${victim.name})`,
      actorRole: 'Victim',
      action: 'DATA_RETENTION_REVIEW_REQUESTED',
      resource: referenceNumber,
      details: `Statutory data retention review lodged. Reason: "${reason}". Consents withdrawn: ${withdrawOptionalConsents}. Non-judicial purge requested: ${purgeNonJudicialHistory}.`,
      ipMasked: '106.198.88.***'
    };
    setAuditLogs(prev => [audit, ...prev]);

    return referenceNumber;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resetDemoData = () => {
    setVictim(INITIAL_VICTIM);
    setCases(INITIAL_CASES);
    setCheckIns(INITIAL_CHECKINS);
    setAlerts(INITIAL_ALERTS);
    setInterventions(INITIAL_INTERVENTIONS);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setIsVictimAuthenticated(true);
  };

  return (
    <SentraContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        isVictimAuthenticated,
        setIsVictimAuthenticated,
        isAuthenticated,
        activeUser,
        loginAsVictim,
        loginAsStaff,
        logout,
        victim,
        cases,
        checkIns,
        alerts,
        interventions,
        appointments,
        notifications,
        auditLogs,
        accessibility,
        setAccessibility,
        submitCheckIn,
        reviewAlert,
        createIntervention,
        confirmAppointment,
        requestRescheduleAppointment,
        updateConsent,
        updateVictimProfile,
        requestDataRetentionReview,
        markNotificationAsRead,
        resetDemoData
      }}
    >
      {children}
    </SentraContext.Provider>
  );
};

export const useSentra = () => {
  const context = useContext(SentraContext);
  if (!context) {
    throw new Error('useSentra must be used within a SentraProvider');
  }
  return context;
};
