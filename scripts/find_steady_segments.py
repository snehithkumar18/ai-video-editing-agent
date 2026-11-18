import cv2
import numpy as np
import glob
import os

videos = sorted(glob.glob("user_raw_assets/*.mp4"))

# For each video, let's sample 1 frame every 0.5s and measure:
# - Camera motion (MSE between consecutive sampled frames)
# - Face presence / centeredness
os.makedirs("debug_steady_search", exist_ok=True)

for vid in videos:
    vname = os.path.basename(vid)
    cap = cv2.VideoCapture(vid)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = total_frames / fps
    
    # Sample every 0.5 sec
    step = int(fps * 0.5)
    sampled = []
    for f in range(0, total_frames, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, f)
        ret, frame = cap.read()
        if not ret: break
        t_sec = f / fps
        sampled.append((t_sec, frame))
    cap.release()
    
    # Measure stability between consecutive samples:
    # A calm, steady shot has moderate difference (subject moving gently, but camera steady)
    # Violent shake or pan has very high difference (> 45)
    print(f"\n--- {vname} (dur: {dur:.1f}s) ---")
    steady_segments = []
    cur_start = None
    for i in range(len(sampled) - 1):
        t1, f1 = sampled[i]
        t2, f2 = sampled[i+1]
        g1 = cv2.cvtColor(f1, cv2.COLOR_BGR2GRAY)
        g2 = cv2.cvtColor(f2, cv2.COLOR_BGR2GRAY)
        diff = np.mean(cv2.absdiff(g1, g2))
        
        # Good steady range: diff between 8 and 30
        is_steady = (8 <= diff <= 32)
        if is_steady:
            if cur_start is None: cur_start = t1
        else:
            if cur_start is not None:
                if t1 - cur_start >= 1.5:
                    steady_segments.append((cur_start, t1, t1 - cur_start))
                cur_start = None
    if cur_start is not None and (sampled[-1][0] - cur_start >= 1.5):
        steady_segments.append((cur_start, sampled[-1][0], sampled[-1][0] - cur_start))
        
    for st, en, l in steady_segments:
        print(f"  Steady segment: {st:.1f}s to {en:.1f}s (length: {l:.1f}s)")
