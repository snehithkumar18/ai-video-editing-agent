import cv2
import numpy as np

imgs = []
for i in range(1, 17):
    p = f"public/processed_reel_assets/photo_{i:02d}.jpg"
    im = cv2.imread(p)
    if im is not None:
        im = cv2.resize(im, (240, 426))
        cv2.putText(im, f"P_{i:02d}", (15, 45), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
        imgs.append(im)

row1 = np.hstack(imgs[0:4])
row2 = np.hstack(imgs[4:8])
row3 = np.hstack(imgs[8:12])
row4 = np.hstack(imgs[12:16])
grid = np.vstack([row1, row2, row3, row4])

cv2.imwrite("public/all_photos_grid.jpg", grid)
print("Saved all_photos_grid.jpg")
