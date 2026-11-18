import cv2
import numpy as np

cap = cv2.VideoCapture("public/renders/aesthetic_viral_reel.mp4")

# Check frames around cut: 105 to 118
cap.set(cv2.CAP_PROP_POS_FRAMES, 105)
frames = []
for i in range(105, 120):
    ret, frame = cap.read()
    if not ret: break
    frames.append((i, frame))

cap.release()

# Calculate difference between each consecutive frame
for i in range(len(frames) - 1):
    f_num1, f1 = frames[i]
    f_num2, f2 = frames[i+1]
    diff = np.mean(cv2.absdiff(f1, f2))
    print(f"Frame {f_num1:3d} -> Frame {f_num2:3d}: diff = {diff:6.2f}")
