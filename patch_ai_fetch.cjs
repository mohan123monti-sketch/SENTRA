const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, 'frontend/src/context/SentraContext.tsx');
let content = fs.readFileSync(contextPath, 'utf8');

const injectionStr = `
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
`;

content = content.replace("    return analysis;\\n  };", injectionStr + "\\n    return analysis;\\n  };");
fs.writeFileSync(contextPath, content);
console.log('Successfully injected AI fetch into SentraContext.tsx');
