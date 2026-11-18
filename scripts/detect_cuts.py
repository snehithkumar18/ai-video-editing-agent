import subprocess
import json
import os

# Run ffmpeg scene detection
cmd = [
    "ffprobe", "-v", "quiet",
    "-show_frames",
    "-show_entries", "frame=pkt_pts_time,pict_type",
    "-select_streams", "v",
    "-f", "lavfi",
    "movie=new_reel_template/source_reel.mp4,select=gt(scene\\,0.25)",
    "-of", "json"
]

res = subprocess.run(cmd, capture_output=True, text=True)
try:
    data = json.loads(res.stdout)
    cuts = [float(f["pkt_pts_time"]) for f in data.get("frames", [])]
    print(f"Detected {len(cuts)} scene cuts using scene filter: {cuts}")
except Exception as e:
    print(f"Error: {e}")
