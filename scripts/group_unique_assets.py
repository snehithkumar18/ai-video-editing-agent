import cv2
import os
import json
import numpy as np

with open("new_reel_template/shots_breakdown.json", "r") as f:
    shots = json.load(f)

cap = cv2.VideoCapture("new_reel_template/source_reel.mp4")
os.makedirs("new_reel_template/shot_samples", exist_ok=True)

shot_images = []
for shot in shots:
    # grab middle frame of shot
    mid_frame_idx = (shot["start_frame"] + shot["end_frame"]) // 2
    cap.set(cv2.CAP_PROP_POS_FRAMES, mid_frame_idx)
    ret, frame = cap.read()
    if ret:
        sample_path = f"new_reel_template/shot_samples/shot_{shot['shot_index']:02d}.jpg"
        cv2.imwrite(sample_path, frame)
        shot_images.append((shot["shot_index"], frame))

cap.release()

# Now compare image similarity between shots to see how many unique photos/clips exist!
unique_groups = []
for idx, img in shot_images:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, (80, 142))
    
    found_match = None
    for group_id, group_repr, members in unique_groups:
        diff = np.mean(cv2.absdiff(gray, group_repr))
        if diff < 15.0: # high similarity
            found_match = group_id
            members.append(idx)
            break
            
    if found_match is None:
        unique_groups.append((len(unique_groups) + 1, gray, [idx]))

print(f"Total shots: {len(shots)}")
print(f"Total UNIQUE photo/video assets identified: {len(unique_groups)}")
for g_id, _, members in unique_groups:
    print(f"Unique Asset #{g_id:02d}: appears in Shot(s) {members}")
