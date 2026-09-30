const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'frontend/src/components/victim/VictimCheckIn.tsx');
let c = fs.readFileSync(p, 'utf8');

const importMatch = "import { Mic, Volume2, Database, ShieldAlert, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';";
const importRepl = "import { Mic, Volume2, Database, ShieldAlert, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';";

const stateMatch = "const [realTranscript, setRealTranscript] = useState<string>('');";
const stateRepl = `const [realTranscript, setRealTranscript] = useState<string>('');
  const [acousticFeatures, setAcousticFeatures] = useState<any>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);`;

const functionMatch = `  const startVoiceRecording = () => {`;
const functionRepl = `  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsAnalyzingAudio(true);
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          
          const response = await fetch('http://127.0.0.1:5000/analyze_audio', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            setAcousticFeatures(data.acousticFeatures);
            console.log("Audio ML Analysis:", data);
          }
        } catch (err) {
          console.warn("Failed to analyze audio", err);
        } finally {
          setIsAnalyzingAudio(false);
        }
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
    } catch (err) {
      console.error("Microphone access denied or error:", err);
    }
`;

const stopVoiceRepl = `  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };`;

const stopVoiceMatchStart = `  const stopVoiceRecording = () => {`;
const stopVoiceMatchEnd = `  };`;

c = c.replace(importMatch, importRepl);
c = c.replace(stateMatch, stateRepl);
c = c.replace(functionMatch, functionRepl);

// manually replace stopVoiceRecording
const stopIdx = c.indexOf(stopVoiceMatchStart);
if (stopIdx !== -1) {
  const endIdx = c.indexOf(stopVoiceMatchEnd, stopIdx) + stopVoiceMatchEnd.length;
  c = c.substring(0, stopIdx) + stopVoiceRepl + c.substring(endIdx);
}

// Add acoustic features to answers
const answersMatch = `      freeTextNote: freeText.trim() ? freeText : undefined,`;
const answersRepl = `      freeTextNote: freeText.trim() ? freeText : undefined,
      acousticFeatures: acousticFeatures,`;
c = c.replace(answersMatch, answersRepl);

// Add loading state UI
const uiMatch = `<CheckCircle2 className="w-4 h-4" /> Audio captured ({recordingSeconds}s)`;
const uiRepl = `{isAnalyzingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} {isAnalyzingAudio ? 'Analyzing pitch & stress...' : \`Audio captured (\${recordingSeconds}s)\`}`;
c = c.replace(uiMatch, uiRepl);

// Display acoustic features if present
const featuresUiMatch = `{realTranscript && (`;
const featuresUiRepl = `{acousticFeatures && !isAnalyzingAudio && (
                      <div className="mt-3 p-3 bg-white/50 rounded-lg text-xs flex gap-3 flex-wrap">
                        <span className="font-semibold text-slate-700">Acoustic ML Flags:</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Pitch: {acousticFeatures.pitchVariability}</span>
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">Energy: {acousticFeatures.energyLevel}</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Rate: {acousticFeatures.speechRate}</span>
                      </div>
                    )}
                    {realTranscript && (`
c = c.replace(featuresUiMatch, featuresUiRepl);


fs.writeFileSync(p, c);
console.log('VictimCheckIn patched for audio');
