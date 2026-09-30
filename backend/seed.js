import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function seed() {
  const db = await open({
    filename: path.join(process.cwd(), 'database', 'sentra.db'),
    driver: sqlite3.Database
  });

  console.log('Seeding database...');

  // 1. Seed Victim Profile
  await db.run(
    `INSERT OR IGNORE INTO victims (id, name, gender, mail, mobileNumber, location, relativeDetails, age, caseId, caseType, preferredLanguage, profilePhotoUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['V-9042', 'Priya S.', 'Female', 'priya@example.com', '9876543210', 'Chennai South', 'Brother', '28', 'CASE-2026-0819', 'Domestic Harassment & Intimidation', 'en', '']
  );

  // 2. Seed Case Record
  await db.run(
    `INSERT OR IGNORE INTO cases (id, caseNumber, victimId, category, stage, filingDate, nextHearingDate, nextEventTitle, courtName, officialUpdates)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'CASE-2026-0819', 
      'CC/2026/4102-S', 
      'V-9042', 
      'Domestic Harassment & Intimidation', 
      'investigation', 
      '2026-08-19', 
      '2026-10-04', 
      'Trial Examination', 
      'Mahila Court, Chennai South', 
      JSON.stringify([
        { date: "2026-08-19", stage: "complaint_registered", title: "FIR Registered", details: "Initial complaint logged." },
        { date: "2026-09-02", stage: "investigation", title: "Statements Recorded", details: "Section 164 statement filed." },
        { date: "2026-09-20", stage: "investigation", title: "Trial Scheduled", details: "Hearing scheduled for October." }
      ])
    ]
  );

  // 3. Seed Check-in Record
  const pastDate = new Date(Date.now() - 3600000 * 2).toISOString();
  await db.run(
    `INSERT OR IGNORE INTO checkins (
      id, victimId, timestamp, overallMood, stressLevel, sleepQuality,
      concentrationScore, productivityScore, happinessScore, physicalWellbeing, eatingHabits,
      feelsSafe, hasSupportToTalk, wantsCounsellorCall, freeTextNote, voiceRecorded,
      voiceTranscript, distressIndicator, sentimentScore, primaryEmotions, caseId, riskLevel
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'CHK-1002', 'V-9042', pastDate, 2, 5, 1, 2, 2, 2, 2, 2, true, false, true, "I'm very anxious about the trial.", false, '', 85, -0.7, 'anxiety,fear', 'CASE-2026-0819', 'priority_review'
    ]
  );

  // 4. Seed Alert
  await db.run(
    `INSERT OR IGNORE INTO alerts (id, victimId, caseId, victimPseudonym, district, severity, createdAt, title, whyFlagged, confidence, modelVersion, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'ALT-789', 'V-9042', 'CASE-2026-0819', 'Priya S.', 'Chennai South', 'priority_review', pastDate, 'Spike in distress metrics', JSON.stringify(["High stress before trial", "Requested call"]), 94, '2.4.1', 'new'
    ]
  );

  // 5. Seed Intervention
  await db.run(
    `INSERT OR IGNORE INTO interventions (id, victimId, caseId, victimPseudonym, createdAt, createdBy, creatorRole, type, title, priority, status, actionNotes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['INT-331', 'V-9042', 'CASE-2026-0819', 'Priya S.', new Date().toISOString(), 'System', 'Automated', 'counselling_session', 'Pre-Trial Desensitization', 'high', 'scheduled', 'Automatic scheduling based on recent distress indicator.']
  );

  // 6. Seed Appointment
  const futureDate = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16);
  await db.run(
    `INSERT OR IGNORE INTO appointments (id, victimId, counsellorName, serviceType, scheduledAt, location, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['APP-551', 'V-9042', 'Dr. Ananya Raman', 'Virtual Therapy Session', futureDate, 'Online Video Call', 'confirmed']
  );

  // 7. Seed Notification
  await db.run(
    `INSERT OR IGNORE INTO notifications (id, recipientRole, recipientId, type, title, message, date, read)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['NOTIF-1', 'victim', 'V-9042', 'checkin_reminder', 'Daily Check-in Reminder', 'Please complete your daily wellbeing check-in.', new Date().toISOString(), false]
  );

  console.log('Seeding complete!');
  await db.close();
}

seed().catch(console.error);
