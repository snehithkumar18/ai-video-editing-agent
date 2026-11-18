import cv2
import os
import numpy as np

user_img = cv2.imread("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/.user_uploaded/media_1794207323454_0b9292e2.png")
user_gray = cv2.cvtColor(user_img, cv2.COLOR_BGR2GRAY)
user_gray = cv2.resize(user_gray, (120, 213))

best_match = None
min_diff = float("inf")

for i in range(1, 12):
    folder = f"video_action_analysis/vid_{i:02d}"
    if not os.path.exists(folder):
        continue
    for f in os.listdir(folder):
        p = os.path.join(folder, f)
        im = cv2.imread(p)
        if im is None:
            continue
        g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
        g = cv2.resize(g, (120, 213))
        diff = float(np.mean(cv2.absdiff(user_gray, g)))
        if diff < min_diff:
            min_diff = diff
            best_match = (i, f, diff)

print(f"Closest match to user uploaded screenshot: Vid {best_match[0]:02d} - {best_match[1]} (diff: {best_match[2]:.2f})")
