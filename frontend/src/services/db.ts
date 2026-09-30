/**
 * SENTRA Persistent Client Database Service
 * Updated to use Node.js Backend API instead of IndexedDB.
 */

import { CheckInRecord, VictimProfile, AuditLogEntry } from '../types/sentra';
import { INITIAL_VICTIM } from '../data/mockData';

const API_URL = 'http://localhost:3001/api';

/* =========================================================================
   CHECK-IN DATABASE OPERATIONS
   ========================================================================= */

export const saveCheckInToDB = async (record: CheckInRecord): Promise<void> => {
  try {
    const payload = {
      id: record.id,
      victimId: record.victimId,
      caseId: record.caseId,
      timestamp: record.timestamp,
      overallMood: record.answers.overallMood,
      stressLevel: record.answers.stressLevel,
      sleepQuality: record.answers.sleepQuality,
      concentrationScore: record.answers.concentrationScore,
      productivityScore: record.answers.productivityScore,
      happinessScore: record.answers.happinessScore,
      physicalWellbeing: record.answers.physicalWellbeing,
      eatingHabits: record.answers.eatingHabits,
      feelsSafe: record.answers.feelsSafe,
      hasSupportToTalk: record.answers.hasSupportToTalk,
      wantsCounsellorCall: record.answers.wantsCounsellorCall,
      freeTextNote: record.answers.freeTextNote,
      voiceRecorded: record.answers.voiceRecorded,
      voiceTranscript: record.answers.voiceTranscript,
      distressIndicator: record.analysis?.distressIndicator,
      sentimentScore: record.analysis?.sentimentScore,
      primaryEmotions: record.analysis?.primaryEmotions,
      riskLevel: record.analysis?.reviewRecommended ? 'HIGH' : 'NORMAL'
    };

    await fetch(`${API_URL}/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Failed to save checkin:', error);
  }
};

export const getCheckInsFromDB = async (victimId?: string): Promise<CheckInRecord[]> => {
  try {
    const url = victimId ? `${API_URL}/checkins?victimId=${victimId}` : `${API_URL}/checkins`;
    const response = await fetch(url);
    if (response.ok) {
      const rows = await response.json();
      return rows.map((row: any) => ({
        id: row.id,
        victimId: row.victimId,
        caseId: row.caseId,
        timestamp: row.timestamp,
        answers: {
          overallMood: row.overallMood,
          stressLevel: row.stressLevel,
          sleepQuality: row.sleepQuality,
          concentrationScore: row.concentrationScore || 3,
          productivityScore: row.productivityScore || 3,
          happinessScore: row.happinessScore || 3,
          physicalWellbeing: row.physicalWellbeing || 3,
          eatingHabits: row.eatingHabits || 3,
          feelsSafe: Boolean(row.feelsSafe),
          hasSupportToTalk: Boolean(row.hasSupportToTalk),
          wantsCounsellorCall: Boolean(row.wantsCounsellorCall),
          freeTextNote: row.freeTextNote,
          voiceRecorded: Boolean(row.voiceRecorded),
          voiceTranscript: row.voiceTranscript
        },
        analysis: {
          checkInId: row.id,
          distressIndicator: row.distressIndicator || 0,
          sentimentScore: row.sentimentScore || 0,
          primaryEmotions: row.primaryEmotions || [],
          baselineDelta: {
            distressDeltaPercent: 0,
            stressDelta: 0,
            sleepDelta: 0,
            engagementDrop: false
          },
          confidenceScore: 0.85,
          modelVersion: '1.0',
          whyFlagged: [],
          featureAttributions: [],
          reviewRecommended: row.riskLevel === 'CRITICAL' || row.riskLevel === 'HIGH'
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to get checkins:', error);
    return [];
  }
};

export const purgeCheckInsFromDB = async (victimId: string): Promise<void> => {
  try {
    await fetch(`${API_URL}/checkins/${victimId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to purge checkins:', error);
  }
};

/* =========================================================================
   VICTIM PROFILE DATABASE OPERATIONS
   ========================================================================= */

export const saveVictimProfileToDB = async (victim: VictimProfile): Promise<void> => {
  try {
    await fetch(`${API_URL}/victims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(victim)
    });
  } catch (error) {
    console.error('Failed to save victim profile:', error);
  }
};

export const getVictimProfileFromDB = async (victimId: string): Promise<VictimProfile | null> => {
  try {
    const response = await fetch(`${API_URL}/victims/${victimId}`);
    if (response.ok) {
      const dbVictim = await response.json();
      return { ...INITIAL_VICTIM, ...dbVictim };
    }
    return null;
  } catch (error) {
    console.error('Failed to get victim profile:', error);
    return null;
  }
};

/* =========================================================================
   AUDIT LOG DATABASE OPERATIONS
   ========================================================================= */

export const saveAuditLogToDB = async (entry: AuditLogEntry): Promise<void> => {
  try {
    await fetch(`${API_URL}/audit_logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
};

/* =========================================================================
   AUTHENTICATION OPERATIONS
   ========================================================================= */

export const sendOtpEmailAPI = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return { success: false, error: 'Network error while sending OTP' };
  }
};

export const authenticateVictimAPI = async (email: string, otp: string): Promise<{ success: boolean; victim?: VictimProfile; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/auth/login/victim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return await response.json();
  } catch (error) {
    console.error('Victim auth failed:', error);
    return { success: false, error: 'Network error during login' };
  }
};

export const authenticateStaffAPI = async (staffId: string, pin: string, role: string): Promise<{ success: boolean; staff?: any; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/auth/login/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, pin, role })
    });
    return await response.json();
  } catch (error) {
    console.error('Staff auth failed:', error);
    return { success: false, error: 'Network error during login' };
  }
};

