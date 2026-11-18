import json
import subprocess
import glob

slots_info = [
    {"slot": 16, "durSec": 1.08, "expectedFrames": round(1.08 * 24)},
    {"slot": 18, "durSec": 1.17, "expectedFrames": round(1.17 * 24)},
    {"slot": 19, "durSec": 0.71, "expectedFrames": round(0.71 * 24)},
    {"slot": 20, "durSec": 1.08, "expectedFrames": round(1.08 * 24)},
    {"slot": 21, "durSec": 0.54, "expectedFrames": round(0.54 * 24)},
    {"slot": 22, "durSec": 0.54, "expectedFrames": round(0.54 * 24)},
    {"slot": 23, "durSec": 0.67, "expectedFrames": round(0.67 * 24)},
    {"slot": 24, "durSec": 1.08, "expectedFrames": round(1.08 * 24)},
    {"slot": 25, "durSec": 0.83, "expectedFrames": round(0.83 * 24)},
    {"slot": 26, "durSec": 0.54, "expectedFrames": round(0.54 * 24)},
    {"slot": 27, "durSec": 0.58, "expectedFrames": round(0.58 * 24)},
    {"slot": 28, "durSec": 1.79, "expectedFrames": round(1.79 * 24)},
    {"slot": 29, "durSec": 0.62, "expectedFrames": round(0.62 * 24)},
    {"slot": 30, "durSec": 1.50, "expectedFrames": round(1.50 * 24)},
]

for s in slots_info:
    f = f"public/processed_reel_assets/clip_slot_{s['slot']:02d}.mp4"
    res = subprocess.run([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-count_frames', '-show_entries',
        'stream=nb_read_frames,duration,r_frame_rate', '-of', 'json', f
    ], capture_output=True, text=True)
    d = json.loads(res.stdout)
    frames = int(d['streams'][0].get('nb_read_frames', 0))
    dur = float(d['streams'][0].get('duration', 0))
    print(f"Slot {s['slot']:02d}: actual_frames={frames:2d}, expected_frames={s['expectedFrames']:2d}, diff={frames - s['expectedFrames']}, duration={dur:.3f}s, needed={s['durSec']:.3f}s")
