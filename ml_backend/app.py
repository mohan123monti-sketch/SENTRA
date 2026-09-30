from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import numpy as np
import xgboost as xgb
import os
import librosa
import soundfile as sf
import tempfile

app = Flask(__name__)
CORS(app)

# 1. Load HuggingFace Emotion Classifier
print("Loading HuggingFace Emotion Classifier...")
emotion_classifier = pipeline(
    "text-classification", 
    model="j-hartmann/emotion-english-distilroberta-base", 
    return_all_scores=True
)
print("Emotion Classifier loaded.")

# 2. Train a synthetic XGBoost model for Distress Prediction
print("Training synthetic XGBoost Distress Model...")
# Features: mood, stress, sleep, concentration, productivity, happiness, physical, eating, feelsSafe, support, wantsCall, sentimentScore
# Target: distressIndicator (0-100)
np.random.seed(42)
X_train = np.random.rand(1000, 12) * 5 # Random scores
y_train = np.random.rand(1000) * 100 # Random distress 0-100

# Make the synthetic data slightly realistic
# higher stress -> higher distress
X_train[:, 1] = X_train[:, 1] * 2
y_train += X_train[:, 1] * 10
# lower mood -> higher distress
y_train += (5 - X_train[:, 0]) * 5

y_train = np.clip(y_train, 0, 100)

xgb_model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=50, max_depth=3)
xgb_model.fit(X_train, y_train)
print("XGBoost Model ready.")

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    answers = data.get('answers', {})
    
    free_text = answers.get('freeTextNote', '')
    emotions_result = []
    primary_emotion = 'neutral'
    
    # Run text through HuggingFace Emotion classifier
    if free_text and free_text.strip():
        try:
            emotions = emotion_classifier(free_text)[0]
            # sort by score
            emotions = sorted(emotions, key=lambda x: x['score'], reverse=True)
            primary_emotion = emotions[0]['label']
            emotions_result = emotions
        except Exception as e:
            print("Emotion classifier error:", e)

    # Prepare features for XGBoost
    # mood, stress, sleep, conc, prod, happ, phys, eat, safe(0/1), support(0/1), call(0/1), sentiment(dummy 0.5)
    features = np.array([[
        answers.get('overallMood', 3),
        answers.get('stressLevel', 3),
        answers.get('sleepQuality', 3),
        answers.get('concentrationScore', 3),
        answers.get('productivityScore', 3),
        answers.get('happinessScore', 3),
        answers.get('physicalWellbeing', 3),
        answers.get('eatingHabits', 3),
        1 if answers.get('feelsSafe', True) else 0,
        1 if answers.get('hasSupportToTalk', True) else 0,
        1 if answers.get('wantsCounsellorCall', False) else 0,
        0.5 # Default sentiment
    ]])
    
    # Predict distress
    distress_score = float(xgb_model.predict(features)[0])
    distress_score = max(0, min(100, distress_score))
    
    # Determine risk state based on score
    review_recommended = False
    if distress_score >= 70 or not answers.get('feelsSafe', True):
        review_recommended = True
    elif distress_score >= 40:
        review_recommended = True
        
    return jsonify({
        "distressIndicator": round(distress_score),
        "primaryEmotion": primary_emotion,
        "emotionDetails": emotions_result,
        "reviewRecommended": review_recommended
    })


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

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)
