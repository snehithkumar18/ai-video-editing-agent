import cv2
import os

cap = cv2.VideoCapture("public/processed_reel_assets/clip_slot_16.mp4")
os.makedirs("debug_clip16_frames", exist_ok=True)
idx = 0
while True:
    ret, frame = cap.read()
    if not ret: break
    cv2.imwrite(f"debug_clip16_frames/f_{idx:02d}.jpg", frame)
    idx += 1
cap.release()
print(f"Saved {idx} frames")
