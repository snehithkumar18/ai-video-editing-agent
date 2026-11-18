import os
import cv2
import numpy as np
import subprocess
import json

raw_dir = "user_raw_assets"
processed_dir = "public/processed_reel_assets"
os.makedirs(processed_dir, exist_ok=True)

# 1. PROCESS PHOTOS (16 total)
image_files = sorted([f for f in os.listdir(raw_dir) if f.endswith(".jpeg") or f.endswith(".jpg")])
processed_images = []

print("=== PROCESSING 16 PHOTOS ===")
for i, img_name in enumerate(image_files):
    in_path = os.path.join(raw_dir, img_name)
    out_filename = f"photo_{i+1:02d}.jpg"
    out_path = os.path.join(processed_dir, out_filename)
    
    img = cv2.imread(in_path)
    if img is None:
        continue
    h, w = img.shape[:2]
    
    target_ratio = 9.0 / 16.0
    current_ratio = w / h
    
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        x_start = (w - new_w) // 2
        cropped = img[:, x_start:x_start+new_w]
    else:
        new_h = int(w / target_ratio)
        y_start = max(0, int((h - new_h) * 0.25))
        cropped = img[y_start:y_start+new_h, :]
        
    resized = cv2.resize(cropped, (1080, 1920), interpolation=cv2.INTER_LANCZOS4)
    gaussian = cv2.GaussianBlur(resized, (0, 0), 2.0)
    enhanced = cv2.addWeighted(resized, 1.25, gaussian, -0.25, 0)
    
    cv2.imwrite(out_path, enhanced, [cv2.IMWRITE_JPEG_QUALITY, 98])
    processed_images.append(f"processed_reel_assets/{out_filename}")
    print(f"Processed Photo {i+1:02d}: {out_filename} (1080x1920)")

# 2. ANALYZE VIDEOS & EXTRACT THE BEST CUTS
slot_requirements = [
    {"slot": 16, "dur": 1.08},
    {"slot": 18, "dur": 1.17},
    {"slot": 19, "dur": 0.71},
    {"slot": 20, "dur": 1.08},
    {"slot": 21, "dur": 0.54},
    {"slot": 22, "dur": 0.54},
    {"slot": 23, "dur": 0.67},
    {"slot": 24, "dur": 1.08},
    {"slot": 25, "dur": 0.83},
    {"slot": 26, "dur": 0.54},
    {"slot": 27, "dur": 0.58},
    {"slot": 28, "dur": 1.79}, # Hero shot!
    {"slot": 29, "dur": 0.62},
    {"slot": 30, "dur": 1.50}, # Outro shot!
]

video_files = sorted([f for f in os.listdir(raw_dir) if f.endswith(".mp4")])

def score_video_segment(cap, start_time, duration, fps):
    start_frame = int(start_time * fps)
    num_frames = max(1, int(duration * fps))
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    
    sharpness_scores = []
    contrast_scores = []
    motion_scores = []
    prev_gray = None
    
    step = max(1, num_frames // 8)
    for _ in range(0, num_frames, step):
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Laplacian variance = sharpness / focus score
        lap = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_scores.append(lap)
        
        # Contrast & dynamic range
        contrast = float(np.std(gray))
        contrast_scores.append(contrast)
        
        if prev_gray is not None:
            diff = float(np.mean(cv2.absdiff(gray, prev_gray)))
            motion_scores.append(diff)
        prev_gray = gray
        
    avg_sharpness = np.mean(sharpness_scores) if sharpness_scores else 0
    avg_contrast = np.mean(contrast_scores) if contrast_scores else 0
    avg_motion = np.mean(motion_scores) if motion_scores else 0
    
    # Highest score: sharp focus + rich contrast + smooth controlled motion
    score = (avg_sharpness * 0.5) + (avg_contrast * 2.0) + (min(avg_motion, 15.0) * 1.5)
    return score

print("\n=== FINDING BEST MOMENTS IN VIDEOS ===")
curated_clips = []

for i, req in enumerate(slot_requirements):
    vid_idx = i % len(video_files)
    vid_name = video_files[vid_idx]
    vid_path = os.path.join(raw_dir, vid_name)
    
    cap = cv2.VideoCapture(vid_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_sec = cap.get(cv2.CAP_PROP_FRAME_COUNT) / fps
    dur = req["dur"]
    
    # Candidate start times across the video
    candidates = []
    t = 1.0
    while t + dur < total_sec - 0.5:
        candidates.append(t)
        t += 1.5
    if not candidates:
        candidates = [0.5]
        
    best_t = candidates[0]
    best_score = -1
    for c_t in candidates:
        s = score_video_segment(cap, c_t, dur, fps)
        if s > best_score:
            best_score = s
            best_t = c_t
    cap.release()
    
    out_vid_name = f"clip_slot_{req['slot']:02d}.mp4"
    out_vid_path = os.path.join(processed_dir, out_vid_name)
    
    # Extract, crop to 9:16, enhance to 1080x1920 high bitrate
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{best_t:.3f}",
        "-t", f"{dur:.3f}",
        "-i", vid_path,
        "-vf", "crop=ih*9/16:ih,scale=1080:1920:flags=lanczos,unsharp=5:5:0.7:5:5:0.3",
        "-c:v", "libx264", "-preset", "slow", "-crf", "18",
        "-an",
        out_vid_path
    ]
    subprocess.run(cmd, capture_output=True)
    curated_clips.append({
        "slot": req["slot"],
        "src": f"processed_reel_assets/{out_vid_name}",
        "source_video": vid_name,
        "start_time": round(best_t, 2),
        "duration": dur,
        "score": round(best_score, 1)
    })
    print(f"Extracted Slot {req['slot']:02d}: {dur}s from {vid_name} @ {best_t:.2f}s (Score: {best_score:.1f})")

with open("public/processed_reel_assets/manifest.json", "w") as f:
    json.dump({
        "photos": processed_images,
        "clips": curated_clips
    }, f, indent=2)

print("\n=== ALL 16 PHOTOS & 14 VIDEO CLIPS PROCESSED TO HIGH QUALITY 1080x1920 ===")
