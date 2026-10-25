import json

with open("reel_reconstruction/analysis/audio_events.json", "r", encoding="utf-8") as f:
    d = json.load(f)

for s in d["segments"]:
    start = s["start"]
    end = s["end"]
    text = s["text"]
    print(f"[{start:05.2f}s - {end:05.2f}s]: {text}")
