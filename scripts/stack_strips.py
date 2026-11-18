import cv2
import numpy as np
import glob

strips = sorted(glob.glob("debug_vid_strips/*.jpg"))
imgs = [cv2.imread(s) for s in strips]
# find max width
max_w = max(im.shape[1] for im in imgs)

padded = []
for s, im in zip(strips, imgs):
    h, w, c = im.shape
    pad = np.zeros((h, max_w, c), dtype=np.uint8)
    pad[:, :w] = im
    label = s.replace("debug_vid_strips\\", "").replace(".jpg", "")
    cv2.putText(pad, label, (max_w - 180, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
    padded.append(pad)

full = np.vstack(padded)
cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/all_video_seconds_overview.png", full)
print("Saved all_video_seconds_overview.png")
