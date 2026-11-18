import os
import cv2
import numpy as np

# Let's inspect the action segments
action_video_selections = [
    {"slot": 16, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "start": 3.0, "dur": 1.08},
    {"slot": 18, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4", "start": 2.0, "dur": 1.17},
    {"slot": 19, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4", "start": 4.0, "dur": 0.71},
    {"slot": 20, "file": "WhatsApp Video 2026-11-09 at 11.46.35.mp4", "start": 2.5, "dur": 1.08},
    {"slot": 21, "file": "WhatsApp Video 2026-11-09 at 11.46.36.mp4", "start": 1.5, "dur": 0.54},
    {"slot": 22, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4", "start": 5.0, "dur": 0.54},
    {"slot": 23, "file": "WhatsApp Video 2026-11-09 at 11.46.39 (1).mp4", "start": 2.0, "dur": 0.67},
    {"slot": 24, "file": "WhatsApp Video 2026-11-09 at 11.46.39.mp4", "start": 1.0, "dur": 1.08},
    {"slot": 25, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4", "start": 3.0, "dur": 0.83},
    {"slot": 26, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4", "start": 12.0, "dur": 0.54},
    {"slot": 27, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4", "start": 10.0, "dur": 0.58},
    {"slot": 28, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4", "start": 8.0, "dur": 1.79},
    {"slot": 29, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4", "start": 7.0, "dur": 0.62},
    {"slot": 30, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "start": 10.5, "dur": 1.50},
]

os.makedirs("debug_actions_overview", exist_ok=True)

for item in action_video_selections:
    slot = item["slot"]
    fpath = os.path.join("user_raw_assets", item["file"])
    cap = cv2.VideoCapture(fpath)
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    start_frame = int(item["start"] * fps)
    dur_frames = int(item["dur"] * fps)
    
    # Sample 3 frames: start, mid, end
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    r1, f1 = cap.read()
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame + dur_frames // 2)
    r2, f2 = cap.read()
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame + dur_frames - 1)
    r3, f3 = cap.read()
    cap.release()
    
    if r1 and r2 and r3:
        h, w = 320, 180
        t = np.hstack([cv2.resize(f1, (w, h)), cv2.resize(f2, (w, h)), cv2.resize(f3, (w, h))])
        cv2.imwrite(f"debug_actions_overview/slot_{slot:02d}.jpg", t)

print("Overview images generated!")
