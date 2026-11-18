import cv2
import numpy as np
import glob

slots = [16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
rows = []
for i in range(0, len(slots), 2):
    pair = slots[i:i+2]
    imgs = []
    for s in pair:
        p = f"debug_actions_overview/slot_{s:02d}.jpg"
        im = cv2.imread(p)
        # put slot label
        cv2.putText(im, f"Slot {s}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        imgs.append(im)
    if len(imgs) == 1:
        imgs.append(np.zeros_like(imgs[0]))
    rows.append(np.hstack(imgs))

sheet = np.vstack(rows)
cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/all_14_video_slots.png", sheet)
print("Saved all_14_video_slots.png")
