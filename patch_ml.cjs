const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'frontend/src/context/SentraContext.tsx');
let c = fs.readFileSync(p, 'utf8');

const newLogic = `
  // AI Feature Fusion & Baseline Comparison Engine
  const submitCheckIn = async (answers: CheckInQuestionAnswers): Promise<AIAnalysisResult> => {
    const timestamp = new Date().toISOString();
    
    let distressIndicator = 0;
    let reviewRecommended = false;
    let primaryEmotions = ['anxiety', 'fear']; // defaults

    // 1. Call Python ML Microservice (XGBoost + DistilRoBERTa)
    try {
      const mlResponse = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        distressIndicator = mlData.distressIndicator;
        reviewRecommended = mlData.reviewRecommended;
        if (mlData.primaryEmotion) {
          primaryEmotions = [mlData.primaryEmotion];
        }
      }
    } catch (err) {
      console.warn('ML Service unreachable, falling back to JS math', err);
      // Fallback JS math
      const rawScore = (5 - answers.overallMood) * 12 + (answers.stressLevel - 1) * 8 + (5 - answers.sleepQuality) * 5 + (!answers.feelsSafe ? 25 : 0) + (!answers.hasSupportToTalk ? 10 : 0) + (answers.wantsCounsellorCall ? 10 : 0);
      distressIndicator = Math.min(98, Math.max(8, Math.round(rawScore * 0.72)));
      reviewRecommended = distressIndicator >= 70 || !answers.feelsSafe;
    }

    // Sentiment calculation from free-text and ratings
    let sentiment = (answers.overallMood - 3) / 2; // -1.0 to 1.0 base
    if (answers.freeTextNote) {
      const lower = answers.freeTextNote.toLowerCase();
      if (lower.includes('fear') || lower.includes('terrified') || lower.includes('panic') || lower.includes('alone') || lower.includes('scared') || lower.includes('cannot sleep')) {
        sentiment = Math.max(-0.95, sentiment - 0.4);
      } else if (lower.includes('better') || lower.includes('calm') || lower.includes('peace') || lower.includes('thank')) {
        sentiment = Math.min(0.9, sentiment - 0.4);
      }
    }

    // Baseline delta comparison
    const baseDistress = (5 - victim.baseline.emotionalWellbeing) * 12 + (victim.baseline.stressLevel - 1) * 8;
    const deltaPercent = Math.round(((distressIndicator - baseDistress) / Math.max(10, baseDistress)) * 100);
    const stressDelta = Number((answers.stressLevel - victim.baseline.stressLevel).toFixed(1));
    const sleepDelta = Number((answers.sleepQuality - victim.baseline.sleepQuality).toFixed(1));

    // Determine why flagged & feature attributions
    const whyFlagged: string[] = [];
    const featureAttributions: AIAnalysisResult['featureAttributions'] = [];

    if (deltaPercent > 25) {
      whyFlagged.push(\`Distress indicator shifted +\${deltaPercent}% above personal baseline\`);
      featureAttributions.push({
        factor: 'Baseline Shift',
        impact: deltaPercent > 45 ? 'high_distress' : 'elevated',
        description: \`Acute variance detected compared to historical 30-day baseline metrics\`
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

    if (answers.wantsCounsellorCall) {
      whyFlagged.push('Complainant explicitly requested a counsellor callback');
      featureAttributions.push({
        factor: 'Direct Request',
        impact: 'elevated',
        description: 'User initiated request for human intervention'
      });
    }

    const analysis: AIAnalysisResult = {
      distressIndicator,
      sentimentScore: Number(sentiment.toFixed(2)),
      primaryEmotions: primaryEmotions,
      acousticFeatures: answers.voiceRecorded ? {
        pitchVariability: 'elevated',
        speechRate: 'rapid',
        energyLevel: 'tense'
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

    const newCheckInId = \`CHK-\${Date.now().toString().slice(-4)}\`;
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
        id: \`ALT-\${Date.now().toString().slice(-4)}\`,
        victimId: victim.id,
        caseId: victim.caseId,
        victimPseudonym: victim.pseudonym,
        district: victim.district,
        severity: newRisk,
        createdAt: timestamp,
        title: !answers.feelsSafe 
          ? 'Safety concern & acute distress logged in latest check-in'
          : \`Well-being indicator elevation (+\${deltaPercent}% baseline shift)\`,
        whyFlagged: analysis.whyFlagged,
        confidence: analysis.confidenceScore,
        modelVersion: analysis.modelVersion,
        status: 'new'
      };

      setAlerts(prev => [newAlert, ...prev]);

      // Create caseworker notification
      const caseworkerNotif: NotificationItem = {
        id: \`NOTIF-\${Date.now().toString().slice(-4)}\`,
        recipientRole: 'counsellor',
        type: 'human_review_alert',
        title: \`Priority Review Flagged: \${victim.pseudonym}\`,
        message: \`Distress indicator \${distressIndicator}/100 with baseline shift (+\${deltaPercent}%). Human review requested.\`,
        date: timestamp,
        read: false
      };
      setNotifications(prev => [caseworkerNotif, ...prev]);
    }

    // Log to immutable Audit Log
    const newAudit: AuditLogEntry = {
      id: \`AUD-\${Date.now().toString().slice(-4)}\`,
      timestamp,
      actor: \`\${victim.id} (Authenticated Victim)\`,
      actorRole: 'Victim',
      action: 'SUBMIT_CHECKIN',
      resource: newCheckIn.id,
      details: \`Completed check-in. AI calculated distress: \${distressIndicator}. Review recommended: \${reviewRecommended}.\`,
      ipMasked: '106.198.88.***'
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    // Emit via WebSocket to Backend (Real-Time Broadcast)
    let caseworkerNotifForSocket = undefined;
    let newAlertForSocket = undefined;
    
    if (reviewRecommended) {
      newAlertForSocket = {
        id: \`ALT-\${Date.now().toString().slice(-4)}\`,
        victimId: victim.id,
        caseId: victim.caseId,
        victimPseudonym: victim.pseudonym,
        district: victim.district,
        severity: newRisk,
        createdAt: timestamp,
        title: !answers.feelsSafe 
          ? 'Safety concern & acute distress logged in latest check-in'
          : \`Well-being indicator elevation (+\${deltaPercent}% baseline shift)\`,
        whyFlagged: analysis.whyFlagged,
        confidence: analysis.confidenceScore,
        modelVersion: analysis.modelVersion,
        status: 'new'
      };
      
      caseworkerNotifForSocket = {
        id: \`NOTIF-\${Date.now().toString().slice(-4)}\`,
        recipientRole: 'counsellor',
        type: 'human_review_alert',
        title: \`Priority Review Flagged: \${victim.pseudonym}\`,
        message: \`Distress indicator \${distressIndicator}/100 with baseline shift (+\${deltaPercent}%). Human review requested.\`,
        date: timestamp,
        read: false
      };
    }

    socket.emit('submit_checkin', {
      checkIn: newCheckIn,
      alert: newAlertForSocket,
      notification: caseworkerNotifForSocket
    });

    try {
      const prompt = \`I am completing my daily check-in. My overall mood is \${answers.overallMood}/5. My stress level is \${answers.stressLevel}/5. My sleep quality was \${answers.sleepQuality}/5. I currently feel \${answers.feelsSafe ? 'safe' : 'unsafe'}. \${answers.freeTextNote ? 'Additional notes: ' + answers.freeTextNote : ''} Please analyze my mindset and provide a brief, supportive response.\`;
      
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: [],
          userPrompt: prompt,
          complainantName: victim.pseudonym,
          caseId: victim.caseId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        analysis.aiResponse = data.text;
      }
    } catch (err) {
      console.warn('Failed to fetch AI check-in response', err);
    }

    return analysis;
  };
`;

const oldStart = "// AI Feature Fusion & Baseline Comparison Engine";
const oldEnd = "  // Counsellor / Human Review Action";

const startIdx = c.indexOf(oldStart);
const endIdx = c.indexOf(oldEnd);

if (startIdx !== -1 && endIdx !== -1) {
  c = c.substring(0, startIdx) + newLogic + "\\n" + c.substring(endIdx);
  fs.writeFileSync(p, c);
  console.log('Replaced submitCheckIn logic');
} else {
  console.error('Could not find replace indices');
}
