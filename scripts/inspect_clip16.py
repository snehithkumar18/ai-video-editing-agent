import cv2
import numpy as np

cap = cv2.VideoCapture("public/processed_reel_assets/clip_slot_16.mp4")
i = 0
prev = None
while True:
    ret, frame = cap.read()
    if not ret: break
    if prev is not None:
        diff = np.mean(cv2.absdiff(frame, prev))
        print(f"clip_slot_16 frame {i-1} -> {i}: diff = {diff:6.2f}")
    prev = frame
    i += 1
cap.release()
