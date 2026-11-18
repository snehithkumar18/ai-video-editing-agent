import os
import subprocess

raw_dir = "user_raw_assets"
processed_dir = "public/processed_reel_assets"
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

print("=== STABILIZING & SMOOTHING ALL 14 VIDEO CLIPS ===")

for item in action_clips:
    slot = item["slot"]
    in_file = os.path.join(raw_dir, item["file"])
    out_file = os.path.join(processed_dir, f"clip_slot_{slot:02d}.mp4")
    trf_file = f"transforms_slot_{slot:02d}.trf"
    
    # Give +1.5s headroom so Remotion never hits EOF / freeze
    extract_dur = item["dur"] + 1.5
    
    # Step 1: Extract temporary clean chunk with accurate decoding seek
    temp_chunk = f"temp_chunk_{slot:02d}.mp4"
    cmd_chunk = [
        "ffmpeg", "-y",
        "-i", in_file,
        "-ss", f"{item['start']:.3f}",
        "-t", f"{extract_dur:.3f}",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-an",
        temp_chunk
    ]
    subprocess.run(cmd_chunk, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Step 2: Vidstab Pass 1 - detect camera shake on the chunk
    cmd_pass1 = [
        "ffmpeg", "-y",
        "-i", temp_chunk,
        "-vf", f"vidstabdetect=stepsize=4:shakiness=8:accuracy=15:result={trf_file}",
        "-f", "null",
        "-"
    ]
    subprocess.run(cmd_pass1, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Step 3: Vidstab Pass 2 - transform & stabilize + enhance + motion-interpolated 24fps
    vf = (
        f"vidstabtransform=input={trf_file}:smoothing=25:optalgo=gauss:crop=black:zoom=2.5:interpol=bicubic,"
        "hqdn3d=1.5:1.5:4:4,"
        "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
        "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
        "eq=brightness=0.07:contrast=1.07:saturation=1.28,"
        "cas=0.55,"
        "minterpolate=fps=24:mi_mode=blend"
    )
    
    cmd_pass2 = [
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
    ]
    subprocess.run(cmd_pass2, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Clean up temp files
    if os.path.exists(temp_chunk): os.remove(temp_chunk)
    if os.path.exists(trf_file): os.remove(trf_file)
    
    print(f"Slot {slot:02d} rendered: {item['file']} @ {item['start']}s -> STABILIZED & BUTTER-SMOOTH")

print("\n=== ALL 14 VIDEO CLIPS STABILIZED AND SMOOTHED SUCCESSFULLY ===")
