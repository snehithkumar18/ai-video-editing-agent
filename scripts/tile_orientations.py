import cv2
import numpy as np

imgs = []
for i in range(1, 12):
    p = f"public/raw_video_checks/vid_{i:02d}.jpg"
    im = cv2.imread(p)
    if im is not None:
        im = cv2.resize(im, (240, 426))
        # Add label
        cv2.putText(im, f"Vid {i:02d}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
        imgs.append(im)

# Pad to 12
blank = np.zeros_like(imgs[0])
imgs.append(blank)

# 3 rows of 4
row1 = np.hstack(imgs[0:4])
row2 = np.hstack(imgs[4:8])
row3 = np.hstack(imgs[8:12])
grid = np.vstack([row1, row2, row3])

cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/all_vids_orientation.png", grid)
print("Saved orientation grid")
