import cv2
import numpy as np

img1 = cv2.imread("debug_clip16_frames/f_22.jpg")
img2 = cv2.imread("debug_clip16_frames/f_23.jpg")
img3 = cv2.imread("debug_clip16_frames/f_24.jpg")
img4 = cv2.imread("debug_clip16_frames/f_25.jpg")

h, w = 480, 270
tile = np.hstack([
    cv2.resize(img1, (w, h)),
    cv2.resize(img2, (w, h)),
    cv2.resize(img3, (w, h)),
    cv2.resize(img4, (w, h))
])
cv2.imwrite("debug_clip16_frames/tail_check.jpg", tile)
print("Saved tail_check.jpg")
