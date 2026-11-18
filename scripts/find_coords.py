import cv2
import numpy as np

im = cv2.imread("public/processed_reel_assets/photo_02.jpg")
h, w = im.shape[:2]

# Let's save a downscaled version with a grid so we know exact coordinates
thumb = cv2.resize(im, (540, 960))
for y in range(100, 900, 100):
    cv2.line(thumb, (0, y), (540, y), (0, 255, 0), 1)
    cv2.putText(thumb, f"y={y*2}", (10, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)
for x in range(100, 500, 100):
    cv2.line(thumb, (x, 0), (x, 960), (0, 255, 0), 1)
    cv2.putText(thumb, f"x={x*2}", (x+5, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

cv2.imwrite("public/photo_02_grid.jpg", thumb)
print("Saved grid")
