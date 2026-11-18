import cv2
import numpy as np
import os

raw_dir = "user_raw_assets"

# Let's inspect candidate videos at 1-sec intervals:
vids_to_check = [
    ("WhatsApp Video 2026-11-09 at 11.46.32.mp4", "vid_32"),
    ("WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "vid_33_1"),
    ("WhatsApp Video 2026-11-09 at 11.46.33.mp4", "vid_33"),
    ("WhatsApp Video 2026-11-09 at 11.46.34.mp4", "vid_34"),
    ("WhatsApp Video 2026-11-09 at 11.46.35.mp4", "vid_35"),
    ("WhatsApp Video 2026-11-09 at 11.46.36.mp4", "vid_36"),
    ("WhatsApp Video 2026-11-09 at 11.46.37.mp4", "vid_37"),
    ("WhatsApp Video 2026-11-09 at 11.46.39 (1).mp4", "vid_39_1"),
    ("WhatsApp Video 2026-11-09 at 11.46.41.mp4", "vid_41"),
]

os.makedirs("debug_vid_strips", exist_ok=True)

for fname, tag in vids_to_check:
    cap = cv2.VideoCapture(os.path.join(raw_dir, fname))
    fps = cap.get(cv2.CAP_PROP_FPS) or 27.33
    total_f = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = total_f / fps
    
    # Grab 1 frame per second
    frames = []
    for s in range(0, int(dur)):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(s * fps))
        ret, frame = cap.read()
        if not ret: break
        # resize to 120x213
        sm = cv2.resize(frame, (120, 213))
        cv2.putText(sm, f"{s}s", (5, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        frames.append(sm)
    cap.release()
    
    # Pack into strip
    if frames:
        strip = np.hstack(frames[:15]) if len(frames) >= 15 else np.hstack(frames)
        cv2.imwrite(f"debug_vid_strips/{tag}.jpg", strip)

print("Saved debug_vid_strips!")
