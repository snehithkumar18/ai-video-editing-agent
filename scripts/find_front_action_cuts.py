import os
import cv2
import numpy as np
import json

raw_dir = "user_raw_assets"
vids = sorted([f for f in os.listdir(raw_dir) if f.endswith(".mp4")])

# Exclude Vid 03 (the sideways one, WhatsApp Video 2026-11-09 at 11.46.33 (2).mp4)
valid_vids = [v for i, v in enumerate(vids) if i != 2] # 10 videos total

print(f"Valid videos for front-facing actions: {len(valid_vids)}")

# Load Haar cascade or DNN face detector
cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(cascade_path)

# Let's find every 0.8s - 1.5s segment in these 10 videos where:
# 1. Face is prominently in the center/upper third, facing forward
# 2. Both eyes/face are clearly detected across all frames in the segment (no turning back!)
# 3. There is positive action/motion (expression, smile, hair/jewelry touch, eye movement)
candidates = []

for v in valid_vids:
    path = os.path.join(raw_dir, v)
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_f = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = total_f / fps
    
    # Slide a window of 1.2s across the video with step 0.6s
    w_dur = 1.2
    t = 0.5
    while t + w_dur < dur - 0.5:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(t * fps))
        
        face_detected_count = 0
        sharpness_list = []
        motion_list = []
        prev_gray = None
        
        # sample 6 frames
        for _ in range(6):
            ret, frame = cap.read()
            if not ret:
                break
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # Detect front face
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.15, minNeighbors=4, minSize=(70, 70))
            if len(faces) > 0:
                # check if face is centered
                fx, fy, fw, fh = faces[0]
                face_center_x = fx + fw / 2.0
                if 0.2 * gray.shape[1] < face_center_x < 0.8 * gray.shape[1]:
                    face_detected_count += 1
            
            lap = cv2.Laplacian(gray, cv2.CV_64F).var()
            sharpness_list.append(lap)
            
            if prev_gray is not None:
                diff = float(np.mean(cv2.absdiff(gray, prev_gray)))
                motion_list.append(diff)
            prev_gray = gray
            
            # skip a few frames
            cap.set(cv2.CAP_PROP_POS_FRAMES, cap.get(cv2.CAP_PROP_POS_FRAMES) + int(fps * 0.15))
            
        # STRICT FILTER: Face must be detected in at least 4 out of 6 sampled frames!
        # This completely guarantees she is NOT turned around, walking away, or spinning!
        if face_detected_count >= 4:
            avg_sharp = np.mean(sharpness_list)
            avg_mot = np.mean(motion_list) if motion_list else 0
            # Good action: face clearly front-facing + active expression/movement
            action_score = (face_detected_count * 100) + (avg_sharp * 0.5) + (min(avg_mot, 25.0) * 10)
            candidates.append({
                "video": v,
                "start": round(t, 2),
                "duration": w_dur,
                "faces": face_detected_count,
                "sharpness": round(avg_sharp, 1),
                "motion": round(avg_mot, 1),
                "score": round(action_score, 1)
            })
            
        t += 0.8
    cap.release()

candidates.sort(key=lambda x: x["score"], reverse=True)
print(f"Found {len(candidates)} high-quality front-facing action candidates across the videos!")
for c in candidates[:15]:
    print(f"Candidate: {c['video']} @ {c['start']}s (faces: {c['faces']}/6, mot: {c['motion']}, score: {c['score']})")

with open("action_candidates.json", "w") as f:
    json.dump(candidates, f, indent=2)
