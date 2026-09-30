import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = 3001;

let db;

// In-memory store for OTPs (In a real app, use Redis or a database)
const otpStore = new Map();

// Configure Nodemailer transporter for Gmail
// Provide your Gmail address and an App Password (not your regular password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your.email@gmail.com',
    pass: process.env.GMAIL_PASS || 'your-app-password'
  }
});

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

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      caseNumber TEXT,
      victimId TEXT,
      category TEXT,
      stage TEXT,
      filingDate TEXT,
      nextHearingDate TEXT,
      nextEventTitle TEXT,
      courtName TEXT,
      officialUpdates TEXT
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      victimId TEXT,
      caseId TEXT,
      victimPseudonym TEXT,
      district TEXT,
      severity TEXT,
      createdAt TEXT,
      title TEXT,
      whyFlagged TEXT,
      confidence INTEGER,
      modelVersion TEXT,
      status TEXT,
      counsellorNotes TEXT,
      reviewedBy TEXT,
      reviewedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS interventions (
      id TEXT PRIMARY KEY,
      victimId TEXT,
      caseId TEXT,
      victimPseudonym TEXT,
      createdAt TEXT,
      createdBy TEXT,
      creatorRole TEXT,
      type TEXT,
      title TEXT,
      priority TEXT,
      status TEXT,
      actionNotes TEXT
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      victimId TEXT,
      counsellorName TEXT,
      serviceType TEXT,
      scheduledAt TEXT,
      location TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipientRole TEXT,
      recipientId TEXT,
      type TEXT,
      title TEXT,
      message TEXT,
      date TEXT,
      read BOOLEAN
    );
  `);
}

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    socket.on('submit_checkin', async (data) => {
      // 1. Broadcast the new check-in to everyone
      io.emit('checkin_added', data.checkIn);
      
      // 2. If there's an alert generated from this check-in, broadcast it
      if (data.alert) {
        await db.run(
          `INSERT OR REPLACE INTO alerts (id, victimId, caseId, victimPseudonym, district, severity, createdAt, title, whyFlagged, confidence, modelVersion, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [data.alert.id, data.alert.victimId, data.alert.caseId, data.alert.victimPseudonym, data.alert.district, data.alert.severity, data.alert.createdAt, data.alert.title, JSON.stringify(data.alert.whyFlagged), data.alert.confidence, data.alert.modelVersion, data.alert.status]
        );
        io.emit('alert_added', data.alert);
      }

      // 3. If there's a notification generated, broadcast it
      if (data.notification) {
        await db.run(
          `INSERT OR REPLACE INTO notifications (id, recipientRole, recipientId, type, title, message, date, read)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [data.notification.id, data.notification.recipientRole, data.notification.recipientId, data.notification.type, data.notification.title, data.notification.message, data.notification.date, false]
        );
        io.emit('notification_added', data.notification);
      }
    });

    // Generic action sync for other real-time updates
    socket.on('action_sync', (data) => {
      socket.broadcast.emit('action_sync', data);
    });
  });

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

// ---- Generic GET Endpoints for State Hydration ----

app.get('/api/cases', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM cases');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM alerts ORDER BY createdAt DESC');
    res.json(rows.map(r => ({...r, whyFlagged: r.whyFlagged ? JSON.parse(r.whyFlagged) : []})));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/interventions', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM interventions ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM appointments ORDER BY scheduledAt ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM notifications ORDER BY date DESC');
    res.json(rows.map(r => ({...r, read: Boolean(r.read)})));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Authentication ----

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store it mapped to the email (expires in 5 minutes)
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    const mailOptions = {
      from: process.env.GMAIL_USER || 'your.email@gmail.com',
      to: email,
      subject: 'Your SENTRA Login Code',
      text: `Your one-time verification password is: ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send OTP via email' });
  }
});

app.post('/api/auth/login/victim', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    // Verify OTP
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp) {
      return res.status(401).json({ error: 'Invalid or missing OTP' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(401).json({ error: 'OTP has expired' });
    }
    
    // Valid OTP, remove it from store
    otpStore.delete(email);

    // Check if victim exists by email
    let victim = await db.get('SELECT * FROM victims WHERE mail = ?', [email]);
    
    if (!victim) {
      // If no victim, create a basic one for the real-time flow
      const newId = `V-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCaseId = `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      await db.run(
        `INSERT INTO victims (id, name, mail, caseId, caseType) VALUES (?, ?, ?, ?, ?)`,
        [newId, 'New User', email, newCaseId, 'General Support']
      );
      
      victim = await db.get('SELECT * FROM victims WHERE id = ?', [newId]);
    }
    
    res.json({ success: true, victim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login/staff', async (req, res) => {
  try {
    const { staffId, pin, role } = req.body;
    if (!staffId || !pin) {
      return res.status(400).json({ error: 'Staff ID and PIN are required' });
    }
    
    res.json({ 
      success: true, 
      staff: {
        id: staffId,
        role: role
      }
    });
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
5. Conciseness: Keep responses easy to read with short paragraphs, gentle bullet points, and actionable calming advice.
6. Mindset Prediction: Start your response by explicitly identifying the user's predicted emotional mindset in brackets (e.g., [Predicted Mindset: Highly Anxious]), and then tailor your tone, pacing, and advice to directly soothe and address that specific mental state.`;

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
    
    // We attempt to call local Ollama first
    try {
      const messages = [
        { role: 'system', content: `${SYSTEM_INSTRUCTION}\nContext: Complainant: ${complainantName}, Linked Case: ${caseId}.` }
      ];

      // Add conversation history
      history
        .filter((m) => m.sender !== 'system')
        .slice(-6)
        .forEach((m) => {
          messages.push({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          });
        });

      // Add the new prompt
      messages.push({ role: 'user', content: userPrompt });

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.1:latest', // use downloaded model
          messages: messages,
          stream: false
        }),
        signal: AbortSignal.timeout(60000) // 60 second timeout for large models
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.message && data.message.content) {
          return res.json({ text: data.message.content });
        }
      } else {
        const errText = await response.text();
        console.warn('Ollama returned an error:', errText);
      }
    } catch (ollamaError) {
      console.warn('Ollama connection/timeout error:', ollamaError.message);
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
  server.listen(PORT, () => {
    console.log(`Server and Socket.io running on http://localhost:${PORT}`);
  });
});
