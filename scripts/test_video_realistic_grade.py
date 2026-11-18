import cv2
import numpy as np
import subprocess

raw_file = "user_raw_assets/WhatsApp Video 2026-11-09 at 11.46.41.mp4" # Slot 20 source
out_test = "test_realistic_clip20.mp4"

# Render test clip with realistic grading
vf = (
    "hqdn3d=1.5:1.5:4:4,"
    "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
    "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
    "eq=brightness=0.03:contrast=1.05:saturation=1.14,"
    "colorbalance=rs=0.01:gs=0.00:bs=-0.02,"
    "cas=0.45,"
    "minterpolate=fps=24:mi_mode=blend"
)

cmd = [
    "ffmpeg", "-y",
    "-i", raw_file,
    "-ss", "1.0",
    "-t", "1.5",
    "-vf", vf,
    "-c:v", libx264 := "libx264",
    "-preset", "fast",
    "-tune", "fastdecode",
    "-g", "1",
    "-crf", "14",
    out_test
]
subprocess.run(cmd, check=True)

# Grab frame from old vibrant clip 20 vs new realistic clip 20
cap_old = cv2.VideoCapture("public/processed_reel_assets/clip_slot_20.mp4")
cap_new = cv2.VideoCapture(out_test)

cap_old.set(cv2.CAP_PROP_POS_FRAMES, 10)
_, f_old = cap_old.read()
cap_new.set(cv2.CAP_PROP_POS_FRAMES, 10)
_, f_new = cap_new.read()

cap_old.release()
cap_new.release()

h, w = 960, 540
s_old = cv2.resize(f_old, (w, h))
s_new = cv2.resize(f_new, (w, h))

cv2.putText(s_old, "Current Vibrant", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)
cv2.putText(s_new, "Ultra Realistic", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)

comp = np.hstack([s_old, s_new])
cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/video_clip_realistic_comparison.png", comp)
print("Saved video_clip_realistic_comparison.png!")
