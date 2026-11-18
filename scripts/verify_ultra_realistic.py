import cv2
import numpy as np

cap = cv2.VideoCapture("public/renders/aesthetic_viral_reel_ultra_realistic.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)

# Sample 1 photo + the 6 smooth video clips
sample_times = [
    ("Photo 06", 1.2),
    ("Clip 1 (Hair & Smile)", 4.5),
    ("Clip 2 (Hands to Cheeks)", 7.0),
    ("Clip 3 (Earring Touch)", 9.3),
    ("Clip 4 (Steady Close-up)", 11.5),
    ("Clip 5 (Framing Cheeks)", 13.5),
    ("Clip 6 (Grand Finale)", 15.5),
]

imgs = []
h, w = 360, 202
for label, t in sample_times:
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(t * fps))
    ret, frame = cap.read()
    if ret:
        sm = cv2.resize(frame, (w, h))
        cv2.putText(sm, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 2)
        imgs.append(sm)

cap.release()

sheet = np.hstack(imgs)
out_p = "C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/ultra_realistic_smooth_overview.png"
cv2.imwrite(out_p, sheet)
print("Saved ultra_realistic_smooth_overview.png")
