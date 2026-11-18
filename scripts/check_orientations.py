import cv2
import os

raw_dir = "user_raw_assets"
vids = sorted([f for f in os.listdir(raw_dir) if f.endswith(".mp4")])

os.makedirs("public/raw_video_checks", exist_ok=True)
for i, v in enumerate(vids):
    cap = cv2.VideoCapture(os.path.join(raw_dir, v))
    cap.set(cv2.CAP_PROP_POS_FRAMES, 30)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(f"public/raw_video_checks/vid_{i+1:02d}.jpg", frame)
    cap.release()
    print(f"vid_{i+1:02d}.jpg: {v}")
