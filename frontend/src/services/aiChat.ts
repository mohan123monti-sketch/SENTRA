export interface ChatMessage {
  id: string;
  sender: 'user' | 'aura' | 'system';
  text: string;
  timestamp: string;
  category?: 'grounding' | 'legal_rights' | 'emotional_support' | 'hearing_prep';
}

const API_URL = 'http://localhost:3001/api';

/**
 * Send a message to Node.js Backend API
 */
export async function sendChatMessage(
  history: ChatMessage[],
  userPrompt: string,
  complainantName = 'Priya',
  caseId = 'CASE-2026-0819'
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        userPrompt,
        complainantName,
        caseId
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.text;
    }
    
    return 'I apologize, but I am having trouble connecting right now. Let us take a gentle breath together.';
  } catch (error) {
    console.error('Failed to send chat message:', error);
    return 'I apologize, but I am having trouble connecting right now. Let us take a gentle breath together.';
  }
}
