import sys
with open('ml_backend/app.py', 'r') as f:
    c = f.read()

import_str = """
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import numpy as np
import xgboost as xgb
import os
import librosa
import soundfile as sf
import tempfile
"""

c = c.replace("""from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import numpy as np
import xgboost as xgb
import os""", import_str.strip())

audio_endpoint = """
@app.route('/analyze_audio', methods=['POST'])
def analyze_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
        
    audio_file = request.files['audio']
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name
        
    try:
        # Load audio using librosa
        y, sr = librosa.load(tmp_path, sr=None)
        
        # 1. Energy level (RMS)
        rms = librosa.feature.rms(y=y)[0]
        mean_energy = np.mean(rms)
        
        # 2. Pitch (F0) using PYIN
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        valid_f0 = f0[~np.isnan(f0)]
        pitch_variability = np.std(valid_f0) if len(valid_f0) > 0 else 0
        
        # 3. Speech Rate Proxy (Onset detection)
        onsets = librosa.onset.onset_detect(y=y, sr=sr)
        duration = librosa.get_duration(y=y, sr=sr)
        speech_rate = len(onsets) / duration if duration > 0 else 0
        
        # Simple heuristics for acoustic distress
        energy_level = 'tense' if mean_energy > 0.1 else ('low' if mean_energy < 0.02 else 'normal')
        pitch_status = 'elevated' if pitch_variability > 40 else ('monotone' if pitch_variability < 10 else 'normal')
        rate_status = 'rapid' if speech_rate > 5.0 else ('slow' if speech_rate < 1.5 else 'normal')
        
        # Calculate a distress multiplier based on voice
        distress_multiplier = 1.0
        if energy_level == 'tense': distress_multiplier += 0.15
        if pitch_status == 'elevated': distress_multiplier += 0.1
        if rate_status == 'rapid' or rate_status == 'slow': distress_multiplier += 0.1
        
        return jsonify({
            'acousticFeatures': {
                'energyLevel': energy_level,
                'pitchVariability': pitch_status,
                'speechRate': rate_status
            },
            'distressMultiplier': round(distress_multiplier, 2)
        })
        
    except Exception as e:
        print("Audio analysis error:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
"""

c = c.replace("if __name__ == '__main__':", audio_endpoint + "\nif __name__ == '__main__':")

with open('ml_backend/app.py', 'w') as f:
    f.write(c)
print("Added audio endpoint to app.py")
