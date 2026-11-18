import os
import subprocess
import json

raw_dir = "user_raw_assets"
files = os.listdir(raw_dir)

videos = [f for f in files if f.endswith(".mp4")]
images = [f for f in files if f.endswith(".jpeg") or f.endswith(".jpg")]

print(f"Total Videos: {len(videos)}, Total Images: {len(images)}")

vid_info = []
for v in sorted(videos):
    path = os.path.join(raw_dir, v)
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration,size:stream=width,height,r_frame_rate",
        "-of", "json", path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    try:
        data = json.loads(res.stdout)
        dur = float(data["format"]["duration"])
        stream = data["streams"][0]
        w = stream["width"]
        h = stream["height"]
        vid_info.append({"name": v, "path": path, "duration": dur, "width": w, "height": h})
        print(f"Video: {v} | {dur:.2f}s | {w}x{h}")
    except Exception as e:
        print(f"Error reading {v}: {e}")
