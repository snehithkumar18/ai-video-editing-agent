import cv2
import numpy as np
import glob

clips = sorted(glob.glob("public/processed_reel_assets/clip_slot_*.mp4"))

for clip_path in clips:
    cap = cv2.VideoCapture(clip_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    prev_gray = None
    shifts = []
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if prev_gray is not None:
            # Calculate optical flow to measure camera shake
            flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            dx = np.median(flow[..., 0])
            dy = np.median(flow[..., 1])
            shifts.append((dx, dy))
        prev_gray = gray
    cap.release()
    
    if shifts:
        dxs = [s[0] for s in shifts]
        dys = [s[1] for s in shifts]
        # Shake is the variance or high-frequency changes in dx, dy
        dx_jitter = np.std(np.diff(dxs)) if len(dxs) > 1 else 0
        dy_jitter = np.std(np.diff(dys)) if len(dys) > 1 else 0
        print(f"{clip_path} ({n_frames} frames): mean shift dx={np.mean(dxs):.2f}, dy={np.mean(dys):.2f} | Jitter std dx={dx_jitter:.2f}, dy={dy_jitter:.2f}")
