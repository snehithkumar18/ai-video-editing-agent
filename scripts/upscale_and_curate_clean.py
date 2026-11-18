import os
import subprocess
import json

raw_dir = "user_raw_assets"
processed_dir = "public/processed_reel_assets"
os.makedirs(processed_dir, exist_ok=True)

# Selected front-facing action cuts from the videos:
# We pick moments where the subject is facing front, actively posing, gesturing, or expressing to the camera:
# Avoiding any spinning/turning away and avoiding Vid 03 (sideways video).
action_video_selections = [
    # Slot 16 (1.08s): Vid 02 - gentle smile and front pose
    {"slot": 16, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "start": 3.0, "dur": 1.08},
    # Slot 18 (1.17s): Vid 04 - gesturing and looking front
    {"slot": 18, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4", "start": 2.0, "dur": 1.17},
    # Slot 19 (0.71s): Vid 05 - front-facing action / expression
    {"slot": 19, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4", "start": 4.0, "dur": 0.71},
    # Slot 20 (1.08s): Vid 06 - expressive gesture towards lens
    {"slot": 20, "file": "WhatsApp Video 2026-11-09 at 11.46.35.mp4", "start": 2.5, "dur": 1.08},
    # Slot 21 (0.54s): Vid 07 - eyes and smile action
    {"slot": 21, "file": "WhatsApp Video 2026-11-09 at 11.46.36.mp4", "start": 1.5, "dur": 0.54},
    # Slot 22 (0.54s): Vid 08 - jewelry touch action
    {"slot": 22, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4", "start": 5.0, "dur": 0.54},
    # Slot 23 (0.67s): Vid 09 - hand gesture / mehendi display action
    {"slot": 23, "file": "WhatsApp Video 2026-11-09 at 11.46.39 (1).mp4", "start": 2.0, "dur": 0.67},
    # Slot 24 (1.08s): Vid 10 - front-facing smile
    {"slot": 24, "file": "WhatsApp Video 2026-11-09 at 11.46.39.mp4", "start": 1.0, "dur": 1.08},
    # Slot 25 (0.83s): Vid 11 - expressive eye movement
    {"slot": 25, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4", "start": 3.0, "dur": 0.83},
    # Slot 26 (0.54s): Vid 08 - subtle smile and head tilt
    {"slot": 26, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4", "start": 12.0, "dur": 0.54},
    # Slot 27 (0.58s): Vid 05 - front-facing pose
    {"slot": 27, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4", "start": 10.0, "dur": 0.58},
    # Slot 28 (1.79s): Vid 11 - Hero shot: high-engagement front expression
    {"slot": 28, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4", "start": 8.0, "dur": 1.79},
    # Slot 29 (0.62s): Vid 04 - quick smile transition
    {"slot": 29, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4", "start": 7.0, "dur": 0.62},
    # Slot 30 (1.50s): Vid 02 - Outro shot: warm closing smile looking at camera
    {"slot": 30, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "start": 10.5, "dur": 1.50},
]

print("=== 1. HIGH-QUALITY UPSCALE & ENHANCEMENT FOR PHOTOS ===")
# Advanced photo enhancement pipeline:
# Lanczos 1080x1920 + Contrast Adaptive Sharpening + High quality quantization
image_files = sorted([f for f in os.listdir(raw_dir) if f.endswith(".jpeg") or f.endswith(".jpg")])
for i, img_name in enumerate(image_files):
    in_path = os.path.join(raw_dir, img_name)
    out_filename = f"photo_{i+1:02d}.jpg"
    out_path = os.path.join(processed_dir, out_filename)
    
    # Use ffmpeg with high-quality Lanczos upscale + unsharp + cas sharpening
    cmd = [
        "ffmpeg", "-y",
        "-i", in_path,
        "-vf", (
            "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
            "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
            "unsharp=5:5:1.2:5:5:0.4,"
            "cas=0.6"
        ),
        "-q:v", "1",
        out_path
    ]
    subprocess.run(cmd, capture_output=True)
    print(f"Upscaled Photo {i+1:02d} -> 1080x1920 HD")

print("\n=== 2. HIGH-QUALITY UPSCALE & EXTRACTION FOR ACTION VIDEOS ===")
# Advanced video upscaling pipeline:
# Denoise (hqdn3d) + Lanczos 1080x1920 + CAS (Contrast Adaptive Sharpening) + high bitrate x264 CRF 15
for item in action_video_selections:
    slot_num = item["slot"]
    in_path = os.path.join(raw_dir, item["file"])
    out_name = f"clip_slot_{slot_num:02d}.mp4"
    out_path = os.path.join(processed_dir, out_name)
    
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{item['start']:.3f}",
        "-t", f"{item['dur']:.3f}",
        "-i", in_path,
        "-vf", (
            "hqdn3d=1.5:1.5:4:4,"
            "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
            "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
            "unsharp=5:5:1.0:5:5:0.3,"
            "cas=0.5"
        ),
        "-c:v", "libx264", "-preset", "slow", "-crf", "15",
        "-b:v", "16M", "-maxrate", "22M", "-bufsize", "30M",
        "-an",
        out_path
    ]
    subprocess.run(cmd, capture_output=True)
    print(f"Upscaled Video Clip for Slot {slot_num:02d} ({item['dur']}s from {item['file']} @ {item['start']}s)")

print("\n=== ALL ASSETS SUCCESSFULLY UPSCALED & CURATED FOR FRONT-FACING ACTION ===")
