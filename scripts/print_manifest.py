import json
with open('new_reel_template/asset_manifest.json') as f:
    d = json.load(f)
for s in d['slots']:
    print(f"Shot {s['shot_index']:2d}: {s['start_sec']:5.2f}s - {s['end_sec']:5.2f}s ({s['duration_sec']:4.2f}s) | type={s['asset_type']}")
