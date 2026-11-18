import cv2
import numpy as np

# Let's inspect photo_01 to photo_16 to find the nose tip area
# The nose tip is typically around x = 500-580, y = 780-900 in a centered 1080x1920 portrait
im = cv2.imread("public/processed_reel_assets/photo_01.jpg")
h, w = im.shape[:2]
print(f"Photo shape: {w}x{h}")

# Let's crop a central face region (x: 440-640, y: 720-960) to inspect
crop = im[700:1000, 440:640]
cv2.imwrite("public/nose_region_sample.jpg", crop)
print("Saved nose_region_sample.jpg")
