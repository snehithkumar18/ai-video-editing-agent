import os
import subprocess

raw_dir = "user_raw_assets"
processed_dir = "public/processed_reel_assets_realistic"
os.makedirs(processed_dir, exist_ok=True)

# 14 curated steady, front-facing action clips
action_clips = [
    {"slot": 16, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "start": 0.0,  "dur": 1.08},
    {"slot": 18, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4",        "start": 1.0,  "dur": 1.17},
    {"slot": 19, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4",        "start": 6.0,  "dur": 0.71},
    {"slot": 20, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4",        "start": 1.0,  "dur": 1.08},
    {"slot": 21, "file": "WhatsApp Video 2026-11-09 at 11.46.36.mp4",        "start": 4.0,  "dur": 0.54},
    {"slot": 22, "file": "WhatsApp Video 2026-11-09 at 11.46.39 (1).mp4",    "start": 6.5,  "dur": 0.54},
    {"slot": 23, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4",        "start": 4.0,  "dur": 0.67},
    {"slot": 24, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4",        "start": 10.0, "dur": 1.08},
    {"slot": 25, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4",        "start": 3.5,  "dur": 0.83},
    {"slot": 26, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4",        "start": 7.0,  "dur": 0.54},
    {"slot": 27, "file": "WhatsApp Video 2026-11-09 at 11.46.39 (1).mp4",    "start": 9.0,  "dur": 0.58},
    {"slot": 28, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4",        "start": 11.5, "dur": 1.79},
    {"slot": 29, "file": "WhatsApp Video 2026-11-09 at 11.46.36.mp4",        "start": 6.0,  "dur": 0.62},
    {"slot": 30, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4",    "start": 13.0, "dur": 1.50},
]

print("=== PROCESSING 14 VIDEO CLIPS WITH ULTRA-REALISTIC COLOR SCIENCE + STABILIZATION ===")

for item in action_clips:
    slot = item["slot"]
    in_file = os.path.join(raw_dir, item["file"])
    out_file = os.path.join(processed_dir, f"clip_slot_{slot:02d}.mp4")
    trf_file = f"transforms_realistic_{slot:02d}.trf"
    
    extract_dur = item["dur"] + 1.5
    temp_chunk = f"temp_chunk_realistic_{slot:02d}.mp4"
    
    # 1. Extract clean chunk
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
    
    # 2. Vidstab Pass 1
    subprocess.run([
        "ffmpeg", "-y",
        "-i", temp_chunk,
        "-vf", f"vidstabdetect=stepsize=4:shakiness=8:accuracy=15:result={trf_file}",
        "-f", "null",
        "-"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # 3. Vidstab Pass 2 + Ultra-Realistic Colors & Fluid Frame Interpolation
    vf = (
        f"vidstabtransform=input={trf_file}:smoothing=25:optalgo=gauss:crop=black:zoom=2.5:interpol=bicubic,"
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
    print(f"Slot {slot:02d} rendered -> ULTRA-REALISTIC & STABILIZED")

print("\n=== ALL 14 REALISTIC VIDEO CLIPS COMPLETED ===")
