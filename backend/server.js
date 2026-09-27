import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

let db;

async function initializeDB() {
  db = await open({
    filename: path.join(process.cwd(), 'database', 'sentra.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      victimId TEXT,
      timestamp TEXT,
      overallMood INTEGER,
      stressLevel INTEGER,
      sleepQuality INTEGER,
      concentrationScore INTEGER,
      productivityScore INTEGER,
      happinessScore INTEGER,
      physicalWellbeing INTEGER,
      eatingHabits INTEGER,
      feelsSafe BOOLEAN,
      hasSupportToTalk BOOLEAN,
      wantsCounsellorCall BOOLEAN,
      freeTextNote TEXT,
      voiceRecorded BOOLEAN,
      voiceTranscript TEXT,
      distressIndicator INTEGER,
      sentimentScore REAL,
      primaryEmotions TEXT,
      caseId TEXT,
      riskLevel TEXT
    );

    CREATE TABLE IF NOT EXISTS victims (
      id TEXT PRIMARY KEY,
      name TEXT,
      gender TEXT,
      mail TEXT,
      mobileNumber TEXT,
      location TEXT,
      relativeDetails TEXT,
      age TEXT,
      caseId TEXT,
      caseType TEXT,
      preferredLanguage TEXT,
      profilePhotoUrl TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      userId TEXT,
      action TEXT,
      details TEXT,
      ipAddress TEXT
    );
  `);
}

// ---- Check-Ins ----

app.post('/api/checkins', async (req, res) => {
  try {
    const { 
      id, victimId, timestamp, overallMood, stressLevel, sleepQuality,
      concentrationScore, productivityScore, happinessScore, physicalWellbeing, eatingHabits,
      feelsSafe, hasSupportToTalk, wantsCounsellorCall, freeTextNote, voiceRecorded,
      voiceTranscript, distressIndicator, sentimentScore, primaryEmotions,
      caseId, riskLevel
    } = req.body;

    await db.run(
      `INSERT OR REPLACE INTO checkins (
        id, victimId, timestamp, overallMood, stressLevel, sleepQuality,
        concentrationScore, productivityScore, happinessScore, physicalWellbeing, eatingHabits,
        feelsSafe, hasSupportToTalk, wantsCounsellorCall, freeTextNote, voiceRecorded,
        voiceTranscript, distressIndicator, sentimentScore, primaryEmotions, caseId, riskLevel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, victimId, timestamp, overallMood, stressLevel, sleepQuality,
        concentrationScore, productivityScore, happinessScore, physicalWellbeing, eatingHabits,
        feelsSafe, hasSupportToTalk, wantsCounsellorCall, freeTextNote, voiceRecorded,
        voiceTranscript, distressIndicator, sentimentScore, primaryEmotions?.join(','), caseId, riskLevel
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/checkins', async (req, res) => {
  try {
    const { victimId } = req.query;
    let query = 'SELECT * FROM checkins ORDER BY timestamp DESC';
    let params = [];

    if (victimId) {
      query = 'SELECT * FROM checkins WHERE victimId = ? ORDER BY timestamp DESC';
      params = [victimId];
    }

    const rows = await db.all(query, params);
    
    // Parse primaryEmotions back to array
    const formatted = rows.map((row) => ({
      ...row,
      feelsSafe: Boolean(row.feelsSafe),
      hasSupportToTalk: Boolean(row.hasSupportToTalk),
      wantsCounsellorCall: Boolean(row.wantsCounsellorCall),
      voiceRecorded: Boolean(row.voiceRecorded),
      primaryEmotions: row.primaryEmotions ? row.primaryEmotions.split(',') : []
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/checkins/:victimId', async (req, res) => {
  try {
    const { victimId } = req.params;
    await db.run('DELETE FROM checkins WHERE victimId = ?', [victimId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Victims ----

app.post('/api/victims', async (req, res) => {
  try {
    const {
      id, name, gender, mail, mobileNumber, location, relativeDetails,
      age, caseId, caseType, preferredLanguage, profilePhotoUrl
    } = req.body;

    await db.run(
      `INSERT OR REPLACE INTO victims (
        id, name, gender, mail, mobileNumber, location, relativeDetails,
        age, caseId, caseType, preferredLanguage, profilePhotoUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, name, gender, mail, mobileNumber, location, relativeDetails,
        age, caseId, caseType, preferredLanguage, profilePhotoUrl
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/victims/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const row = await db.get('SELECT * FROM victims WHERE id = ?', [id]);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Audit Logs ----

app.post('/api/audit_logs', async (req, res) => {
  try {
    const { id, timestamp, userId, action, details, ipAddress } = req.body;
    await db.run(
      `INSERT INTO audit_logs (id, timestamp, userId, action, details, ipAddress)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, timestamp, userId, action, details, ipAddress]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- AI Chat ----

const SYSTEM_INSTRUCTION = `You are AURA (Automated Understanding & Reassurance Assistant), the confidential, trauma-informed AI companion inside the SENTRA justice and victim support platform.

Your primary mission is to offer gentle, compassionate emotional support, hearing anxiety de-escalation, and non-prescriptive procedural clarity to registered complainants and victims of offences.

Key Communication Guidelines:
1. Warmth & Validation: Always acknowledge the emotional difficulty of the legal process. Validate feelings without pitying.
2. Trauma-Informed & Grounded: Use calming, steady language. Offer sensory grounding techniques when panic or tension is sensed.
3. Legal Procedural Guidance: You can explain procedural concepts. Clarify that procedural explanations are informational and advise consulting their assigned counsel or caseworker.
4. Boundaries & Safety: Never offer definitive judicial verdicts. If severe self-harm or imminent danger is expressed, immediately encourage contacting emergency helplines.
5. Conciseness: Keep responses easy to read with short paragraphs, gentle bullet points, and actionable calming advice.`;

function generateEmpatheticFallback(prompt, complainantName) {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('cross') || lower.includes('court') || lower.includes('hearing') || lower.includes('trial') || lower.includes('facing')) {
    return `Hello ${complainantName}. It is completely natural to feel dread or tension about facing court proceedings. Many people feel this exact knot in their stomach.\n\nHere are three grounding anchors to keep in mind for your hearing:\n1. **Take Your Time:** You do not have to answer questions in a hurry.\n2. **Stick Only to Your Truth:** If you do not remember a detail, saying "I do not recall" is completely valid.\n3. **Protection & In-Camera Rights:** Under Vulnerable Witness Guidelines, your advocate can petition for screen barriers.\n\nWould you like to do a quick 2-minute breathing exercise right now?`;
  }
  
  if (lower.includes('breath') || lower.includes('panic') || lower.includes('calm') || lower.includes('anxious')) {
    return `Let's take a slow, gentle moment together right now, ${complainantName}. You are in a safe space.\n\n**4-7-8 Centering Breath:**\n• **Breathe In** through your nose slowly for **4 seconds**...\n• **Hold gently** for **7 seconds**...\n• **Exhale smoothly** through your mouth for **8 seconds**...\n\nNotice your feet resting flat on the ground. You do not have to carry the whole weight of tomorrow right this second.`;
  }
  
  if (lower.includes('protect') || lower.includes('safe') || lower.includes('threat') || lower.includes('fear')) {
    return `${complainantName}, your physical and psychological safety is paramount under the National Witness Protection Scheme.\n\nStatutory protections available to you:\n• **Identity Concealment**\n• **Courtroom Escort**\n• **DLSA Immediate Grievance**\n\nIf you ever feel in immediate danger right now, please call **112** (Emergency) or **1091** (Women Helpline) immediately.`;
  }
  
  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('night') || lower.includes('rest')) {
    return `Sleeplessness is one of the most common ways the nervous system responds to legal stress.\n\nA gentle sleep preparation routine for tonight:\n• **Write It Down & Close It:** Keep a small notebook by your bed.\n• **Warm Sensory Grounding:** Sip warm water or chamomile tea.\n• **Progressive Muscle Release:** Starting from your toes, gently squeeze for 3 seconds, then release completely.\n\nWould you like to try our Calming Games?`;
  }
  
  return `Thank you for sharing that with me, ${complainantName}. I am right here with you.\n\nGoing through legal proceedings is an enormous emotional marathon, and every feeling you have is completely valid.\n\nRemember that you are not alone in this journey.\nIs there a specific question on your mind about your case, or would you like to explore a relaxation exercise?`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { history, userPrompt, complainantName = 'Priya', caseId = 'CASE-2026-0819' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || '';

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      
      const formattedContents = history
        .filter((m) => m.sender !== 'system')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      formattedContents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION}\nContext: Complainant: ${complainantName}, Linked Case: ${caseId}.`
        }
      });

      if (response && response.text) {
        res.json({ text: response.text });
        return;
      }
    }

    const fallbackResponse = generateEmpatheticFallback(userPrompt, complainantName);
    res.json({ text: fallbackResponse });

  } catch (error) {
    console.error('AI Chat Error:', error);
    const fallbackResponse = generateEmpatheticFallback(req.body.userPrompt || '', req.body.complainantName || 'Priya');
    res.json({ text: fallbackResponse });
  }
});

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
