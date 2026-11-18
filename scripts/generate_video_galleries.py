import cv2
import os
import numpy as np

os.makedirs("public/video_galleries", exist_ok=True)

vids = sorted([f for f in os.listdir("video_action_analysis") if f.startswith("vid_")])

for v in vids:
    folder = os.path.join("video_action_analysis", v)
    frames = sorted([f for f in os.listdir(folder) if f.endswith(".jpg")])
    if not frames:
        continue
    
    loaded = []
    for f in frames:
        p = os.path.join(folder, f)
        im = cv2.imread(p)
        if im is not None:
            # timestamp label
            sec_str = f.replace("sec_", "").replace(".jpg", "s")
            cv2.putText(im, sec_str, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            loaded.append(im)
            
    # Pad to multiple of 4
    while len(loaded) % 4 != 0:
        loaded.append(np.zeros_like(loaded[0]))
        
    rows = []
    for r in range(0, len(loaded), 4):
        rows.append(np.hstack(loaded[r:r+4]))
    gallery = np.vstack(rows)
    cv2.imwrite(f"public/video_galleries/{v}_gallery.jpg", gallery)
    print(f"Generated gallery for {v}: {len(frames)} frames")
