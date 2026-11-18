import os
import subprocess

raw_dir = "user_raw_assets"
processed_dir = "public/processed_reel_assets"
os.makedirs(processed_dir, exist_ok=True)

# 14 front-facing action cuts, curated from active posing moments:
action_video_selections = [
    {"slot": 16, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "start": 3.0, "dur": 1.08},
    {"slot": 18, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4", "start": 2.0, "dur": 1.17},
    {"slot": 19, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4", "start": 4.0, "dur": 0.71},
    {"slot": 20, "file": "WhatsApp Video 2026-11-09 at 11.46.35.mp4", "start": 2.5, "dur": 1.08},
    {"slot": 21, "file": "WhatsApp Video 2026-11-09 at 11.46.36.mp4", "start": 1.5, "dur": 0.54},
    {"slot": 22, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4", "start": 5.0, "dur": 0.54},
    {"slot": 23, "file": "WhatsApp Video 2026-11-09 at 11.46.39 (1).mp4", "start": 2.0, "dur": 0.67},
    {"slot": 24, "file": "WhatsApp Video 2026-11-09 at 11.46.39.mp4", "start": 1.0, "dur": 1.08},
    {"slot": 25, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4", "start": 3.0, "dur": 0.83},
    {"slot": 26, "file": "WhatsApp Video 2026-11-09 at 11.46.37.mp4", "start": 12.0, "dur": 0.54},
    {"slot": 27, "file": "WhatsApp Video 2026-11-09 at 11.46.34.mp4", "start": 10.0, "dur": 0.58},
    {"slot": 28, "file": "WhatsApp Video 2026-11-09 at 11.46.41.mp4", "start": 8.0, "dur": 1.79},
    {"slot": 29, "file": "WhatsApp Video 2026-11-09 at 11.46.33.mp4", "start": 7.0, "dur": 0.62},
    {"slot": 30, "file": "WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4", "start": 10.5, "dur": 1.50},
]

print("=== RE-ENCODING VIDEO CLIPS: ALL INTRA-FRAME 24FPS + BRIGHT & VIBRANT ===")

for item in action_video_selections:
    slot_num = item["slot"]
    in_path = os.path.join(raw_dir, item["file"])
    out_name = f"clip_slot_{slot_num:02d}.mp4"
    out_path = os.path.join(processed_dir, out_name)
    
    # Filter graph:
    # 1. hqdn3d (gentle denoise to remove compression artifacts)
    # 2. crop to 9:16 vertical
    # 3. scale to 1080:1920 with lanczos
    # 4. eq: brightness +0.07, contrast 1.07, saturation 1.28 (radiant, colourful, non-dark!)
    # 5. cas=0.55 (AMD Contrast Adaptive Sharpening)
    # 6. fps=24 (exact 24.000 fps constant frame rate)
    vf = (
        "hqdn3d=1.5:1.5:4:4,"
        "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
        "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
        "eq=brightness=0.07:contrast=1.07:saturation=1.28,"
        "cas=0.55,"
        "fps=24"
    )
    
    # Strict keyframe encoding:
    # -g 1 (ALL intra-frames, zero stutter, seamless cuts!)
    # -tune fastdecode
    # -reset_timestamps 1 -avoid_negative_ts make_zero
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{item['start']:.3f}",
        "-t", f"{item['dur']:.3f}",
        "-i", in_path,
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "slow",
        "-tune", "fastdecode",
        "-g", "1",
        "-keyint_min", "1",
        "-crf", "14",
        "-b:v", "18M",
        "-maxrate", "24M",
        "-bufsize", "30M",
        "-avoid_negative_ts", "make_zero",
        "-reset_timestamps", "1",
        "-an",
        out_path
    ]
    subprocess.run(cmd, capture_output=True)
    print(f"Slot {slot_num:02d} ({item['dur']}s from {item['file']}) -> 1080x1920 @ 24fps (ALL I-FRAMES, VIBRANT)")

print("\n=== ALL VIDEO CLIPS RE-ENCODED SUCCESSFULLY ===")
