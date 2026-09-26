import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aura' | 'system';
  text: string;
  timestamp: string;
  category?: 'grounding' | 'legal_rights' | 'emotional_support' | 'hearing_prep';
}

const SYSTEM_INSTRUCTION = `You are AURA (Automated Understanding & Reassurance Assistant), the confidential, trauma-informed AI companion inside the SENTRA justice and victim support platform.

Your primary mission is to offer gentle, compassionate emotional support, hearing anxiety de-escalation, and non-prescriptive procedural clarity to registered complainants and victims of offences.

Key Communication Guidelines:
1. Warmth & Validation: Always acknowledge the emotional difficulty of the legal process. Validate feelings without pitying ("It is completely understandable to feel overwhelmed ahead of a court appearance").
2. Trauma-Informed & Grounded: Use calming, steady language. Offer sensory grounding techniques (5-4-3-2-1, box breathing) when panic or tension is sensed.
3. Legal Procedural Guidance: You can explain procedural concepts (What is a trial hearing, cross-examination basics, DLSA legal aid rights, vulnerable witness courtroom shields, in-camera proceedings, the Witness Protection Scheme). Clarify that procedural explanations are informational and advise consulting their assigned counsel or caseworker.
4. Boundaries & Safety: Never offer definitive judicial verdicts. If severe self-harm or imminent danger is expressed, immediately encourage contacting emergency helplines: National Emergency 112, Women Helpline 1091/181, or Tele-MANAS 14416.
5. Conciseness: Keep responses easy to read with short paragraphs, gentle bullet points, and actionable calming advice.`;

/**
 * Send a message to Gemini AI with contextual fallback
 */
export async function sendChatMessage(
  history: ChatMessage[],
  userPrompt: string,
  complainantName = 'Priya',
  caseId = 'CASE-2026-0819'
): Promise<string> {
  const apiKey = 
    (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) ||
    '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Build conversation context
      const formattedContents = history
        .filter(m => m.sender !== 'system')
        .slice(-6)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      formattedContents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents as any,
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION}\nContext: Complainant: ${complainantName}, Linked Case: ${caseId}.`
        }
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini API call failed, using trauma-informed fallback agent:', err);
    }
  }

  // Trauma-informed context-aware local response engine
  return generateEmpatheticFallback(userPrompt, complainantName);
}

function generateEmpatheticFallback(prompt: string, complainantName: string): string {
  const lower = prompt.toLowerCase();

  // 1. Cross-examination / Court hearing anxiety
  if (lower.includes('cross') || lower.includes('court') || lower.includes('hearing') || lower.includes('trial') || lower.includes('facing')) {
    return `Hello ${complainantName}. It is completely natural to feel dread or tension about facing court proceedings. Many people feel this exact knot in their stomach.

Here are three grounding anchors to keep in mind for your hearing:
1. **Take Your Time:** You do not have to answer questions in a hurry. You are entitled to pause, take a breath, and ask the advocate or the Hon'ble Judge to repeat or clarify any confusing question.
2. **Stick Only to Your Truth:** If you do not remember a detail, saying "I do not recall" is completely valid and legally protected. You never have to guess.
3. **Protection & In-Camera Rights:** Under Vulnerable Witness Guidelines, your advocate can petition for screen barriers or an in-camera hearing so you do not have direct eye contact with the other party.

Would you like to do a quick 2-minute breathing exercise right now, or make a checklist of questions for your caseworker?`;
  }

  // 2. Breathing / Calming / Panic / Overwhelmed
  if (lower.includes('breath') || lower.includes('panic') || lower.includes('calm') || lower.includes('anxious') || lower.includes('relax') || lower.includes('ground')) {
    return `Let's take a slow, gentle moment together right now, ${complainantName}. You are in a safe space.

**4-7-8 Centering Breath:**
• **Breathe In** through your nose slowly for **4 seconds**... 🌿
• **Hold gently** for **7 seconds**... (feel the stillness)
• **Exhale smoothly** through your mouth for **8 seconds**... (let your shoulders drop)

Notice your feet resting flat on the ground. Feel the support beneath you. Repeat this twice. You do not have to carry the whole weight of tomorrow right this second. One moment at a time.`;
  }

  // 3. Witness Protection / Safety concerns
  if (lower.includes('protect') || lower.includes('safe') || lower.includes('threat') || lower.includes('fear') || lower.includes('rights')) {
    return `${complainantName}, your physical and psychological safety is paramount under the National Witness Protection Scheme.

Statutory protections available to you:
• **Identity Concealment:** Pseudonymization of personal demographic details in public causelists and registers.
• **Courtroom Escort:** You have the statutory right to request a designated protection officer or female police escort when travelling to and from the court premises.
• **DLSA Immediate Grievance:** If anyone attempts intimidation or contact, your District Support Officer and Case Worker must log an immediate violation report.

If you ever feel in immediate danger right now, please call **112** (Emergency) or **1091** (Women Helpline) immediately. I can also notify your assigned caseworker Dr. Ananya Raman right away.`;
  }

  // 4. Sleeplessness / Insomnia / Night stress
  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('night') || lower.includes('rest')) {
    return `Sleeplessness is one of the most common ways the nervous system responds to legal stress. Your body is staying on high alert to protect you.

A gentle sleep preparation routine for tonight:
• **Write It Down & Close It:** Keep a small notebook by your bed. Write down whatever thoughts are racing, then close the book to signal to your brain that it is stored for tomorrow.
• **Warm Sensory Grounding:** Sip warm water or chamomile tea, and dim overhead lights 30 minutes before resting.
• **Progressive Muscle Release:** Starting from your toes, gently squeeze for 3 seconds, then release completely. Move up to your calves, thighs, and shoulders.

Would you like to try our Zen Sand Garden or Mindful Bubble game in the **Calming Games** tab to help settle your thoughts?`;
  }

  // Default empathetic response
  return `Thank you for sharing that with me, ${complainantName}. I am right here with you.

Going through legal proceedings is an enormous emotional marathon, and every feeling you have—uncertainty, anger, fatigue, or hope—is completely valid. 

Remember that you are not alone in this journey:
• Your assigned counsellor **Dr. Ananya Raman** and support officer are actively linked to your case file.
• You can check in your well-being anytime in the **Check-in** tab.
• You can play our soothing grounding exercises in the **Calming Games** tab whenever your mind needs a peaceful diversion.

Is there a specific question on your mind about your case, or would you like to explore a relaxation exercise?`;
}
