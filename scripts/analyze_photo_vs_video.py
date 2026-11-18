import cv2
import json
import numpy as np

with open("new_reel_template/shots_breakdown.json", "r") as f:
    shots = json.load(f)

cap = cv2.VideoCapture("new_reel_template/source_reel.mp4")

results = []
for shot in shots:
    start_f = shot["start_frame"]
    end_f = shot["end_frame"]
    dur_f = end_f - start_f
    
    # Read first and last frame of shot
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_f)
    ret1, f1 = cap.read()
    cap.set(cv2.CAP_PROP_POS_FRAMES, max(start_f, end_f - 1))
    ret2, f2 = cap.read()
    
    if ret1 and ret2:
        g1 = cv2.cvtColor(f1, cv2.COLOR_BGR2GRAY)
        g2 = cv2.cvtColor(f2, cv2.COLOR_BGR2GRAY)
        internal_diff = float(np.mean(cv2.absdiff(g1, g2)))
    else:
        internal_diff = 0.0
        
    # If internal_diff is very low (< 3.0), it's a static PHOTO (or photo with subtle pan/zoom)
    # If internal_diff > 4.0, it's a VIDEO clip (head movement, smile, hand movement)
    asset_type = "video" if internal_diff > 4.5 and dur_f > 10 else "photo"
    
    results.append({
        "shot_index": shot["shot_index"],
        "start_sec": shot["start_sec"],
        "end_sec": shot["end_sec"],
        "duration_sec": shot["duration_sec"],
        "duration_frames": dur_f,
        "internal_motion": round(internal_diff, 2),
        "asset_type": asset_type
    })

cap.release()

photo_count = sum(1 for r in results if r["asset_type"] == "photo")
video_count = sum(1 for r in results if r["asset_type"] == "video")

print(f"Analysis:")
print(f"Total slots: {len(results)}")
print(f"Classified as Photos: {photo_count}")
print(f"Classified as Videos: {video_count}")

with open("new_reel_template/asset_manifest.json", "w") as f:
    json.dump({
        "total_slots": len(results),
        "total_duration": 16.38,
        "fps": 24,
        "photo_slots_count": photo_count,
        "video_slots_count": video_count,
        "slots": results
    }, f, indent=2)

for r in results:
    print(f"Slot {r['shot_index']:02d} | {r['start_sec']:5.2f}s - {r['end_sec']:5.2f}s ({r['duration_sec']:4.2f}s) | {r['asset_type'].upper():5s} | motion: {r['internal_motion']}")
