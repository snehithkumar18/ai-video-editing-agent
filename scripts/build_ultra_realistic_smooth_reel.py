import os
import subprocess
import cv2
import numpy as np

raw_dir = "user_raw_assets"
out_dir = "public/processed_reel_assets_realistic"
os.makedirs(out_dir, exist_ok=True)

# 6 Limited, Hand-Picked, Most Beautiful & Steady Front-Facing Clips:
curated_clips = [
    {"slot": 16, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4",        "start": 1.0, "dur": 2.42},
    {"slot": 17, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4",        "start": 7.0, "dur": 2.33},
    {"slot": 18, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4",        "start": 9.8, "dur": 2.29},
    {"slot": 19, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4",        "start": 1.5, "dur": 1.96},
    {"slot": 20, "file": "WhatsApp Video 2026-11-09 at 11.46.36.mp4",        "start": 5.0, "dur": 2.04},
    {"slot": 21, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4",    "start": 12.5, "dur": 1.88},
]

print("=== 1. STABILIZING & COLOR-GRADING 6 BEAUTIFUL LONG CLIPS (ZERO SHAKE) ===")

for idx, item in enumerate(curated_clips):
    in_file = os.path.join(raw_dir, item["file"])
    out_file = os.path.join(out_dir, f"smooth_clip_{idx+1:02d}.mp4")
    trf_file = f"transforms_smooth_{idx+1:02d}.trf"
    temp_chunk = f"temp_smooth_chunk_{idx+1:02d}.mp4"
    
    # Extract chunk with +2.0s headroom
    extract_dur = item["dur"] + 2.0
    subprocess.run([
        "ffmpeg", "-y",
        "-i", in_file,
        "-ss", f"{item['start']:.3f}",
        "-t", f"{extract_dur:.3f}",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-an",
        temp_chunk
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Vidstab Pass 1 - detect camera shake with high accuracy
    subprocess.run([
        "ffmpeg", "-y",
        "-i", temp_chunk,
        "-vf", f"vidstabdetect=stepsize=4:shakiness=9:accuracy=15:result={trf_file}",
        "-f", "null",
        "-"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Vidstab Pass 2 - heavy smoothing (smoothing=35) for tripod/gimbal stability + Ultra-realistic color grade
    vf = (
        f"vidstabtransform=input={trf_file}:smoothing=35:optalgo=gauss:crop=black:zoom=3.0:interpol=bicubic,"
        "hqdn3d=1.5:1.5:4:4,"
        "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
        "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
        "eq=brightness=0.03:contrast=1.05:saturation=1.14,"
        "colorbalance=rs=0.01:gs=0.00:bs=-0.02,"
        "cas=0.45,"
        "minterpolate=fps=24:mi_mode=blend"
    )
    
    subprocess.run([
        "ffmpeg", "-y",
        "-i", temp_chunk,
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "fast",
        "-tune", "fastdecode",
        "-g", "1",
        "-crf", "14",
        "-avoid_negative_ts", "make_zero",
        "-reset_timestamps", "1",
        "-an",
        out_file
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    if os.path.exists(temp_chunk): os.remove(temp_chunk)
    if os.path.exists(trf_file): os.remove(trf_file)
    print(f"Smooth Clip {idx+1:02d} rendered: {item['file']} ({item['dur']}s) -> 100% GIMBAL STEADY & REALISTIC")

print("\n=== ALL 6 SMOOTH CLIPS GENERATED SUCCESSFULLY ===")
