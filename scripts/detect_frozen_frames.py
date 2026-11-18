import cv2
import numpy as np

# Open the rendered video public/renders/aesthetic_viral_reel.mp4
cap = cv2.VideoCapture("public/renders/aesthetic_viral_reel.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

print(f"Total frames: {total_frames}, FPS: {fps}")

# Read all frames and compute frame-to-frame difference (MSE)
# If MSE == 0 between consecutive frames during a video clip, it means the video is FROZEN / STRUCK!
prev_gray = None
frozen_ranges = []
current_frozen_start = None

for frame_idx in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    if prev_gray is not None:
        diff = cv2.absdiff(gray, prev_gray)
        mse = np.mean(diff)
        
        # If mse is virtually zero (< 0.1) in consecutive frames:
        if mse < 0.05:
            if current_frozen_start is None:
                current_frozen_start = frame_idx - 1
        else:
            if current_frozen_start is not None:
                frozen_ranges.append((current_frozen_start, frame_idx - 1, (frame_idx - 1 - current_frozen_start + 1)))
                current_frozen_start = None
    prev_gray = gray

if current_frozen_start is not None:
    frozen_ranges.append((current_frozen_start, total_frames - 1, total_frames - current_frozen_start))

cap.release()

print("\n--- FROZEN / STRUCK FRAME RANGES (identical consecutive frames) ---")
for start, end, count in frozen_ranges:
    sec_start = start / fps
    sec_end = end / fps
    print(f"Frames {start:3d} to {end:3d} ({count:2d} frames, {count/fps:.2f}s): from {sec_start:.2f}s to {sec_end:.2f}s")
