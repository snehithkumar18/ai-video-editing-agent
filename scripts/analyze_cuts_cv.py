import cv2
import numpy as np
import json

cap = cv2.VideoCapture("new_reel_template/source_reel.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

print(f"Total frames: {total_frames}, FPS: {fps}, Duration: {total_frames / fps:.2f}s")

prev_frame = None
cuts = [0]
diffs = []

frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, (160, 284))
    
    if prev_frame is not None:
        # Calculate mean absolute difference
        diff = np.mean(cv2.absdiff(gray, prev_frame))
        diffs.append((frame_idx, diff))
    prev_frame = gray
    frame_idx += 1

cap.release()

# Find sharp peaks in diffs
# A cut produces a very distinct large difference compared to adjacent frames
threshold = 25.0  # Cut threshold for 8-bit diff
scene_changes = [0]
for idx, diff in diffs:
    if diff > threshold:
        # Check if it's not right next to the previous cut (debounce 3 frames)
        if idx - scene_changes[-1] > 3:
            scene_changes.append(idx)

# Include final frame
scene_changes.append(total_frames)

print(f"Detected {len(scene_changes)-1} shots/clips:")
shots = []
for i in range(len(scene_changes) - 1):
    start_f = scene_changes[i]
    end_f = scene_changes[i+1]
    start_s = start_f / fps
    end_s = end_f / fps
    dur_s = end_s - start_s
    shots.append({
        "shot_index": i + 1,
        "start_frame": start_f,
        "end_frame": end_f,
        "duration_frames": end_f - start_f,
        "start_sec": round(start_s, 2),
        "end_sec": round(end_s, 2),
        "duration_sec": round(dur_s, 2),
    })
    print(f"Shot {i+1:02d}: {start_s:5.2f}s -> {end_s:5.2f}s ({dur_s:4.2f}s, {end_f-start_f} frames)")

with open("new_reel_template/shots_breakdown.json", "w") as f:
    json.dump(shots, f, indent=2)
