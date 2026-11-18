import cv2
import numpy as np

# Compare raw vs current processed for Photo 06 and Video Slot 20
raw_p6 = cv2.imread("user_raw_assets/WhatsApp Image 2026-11-09 at 11.46.31 (3).jpeg")
proc_p6 = cv2.imread("public/processed_reel_assets/photo_06.jpg")

# Resize both to 540x960
h, w = 960, 540
raw_sm = cv2.resize(raw_p6, (w, h))
proc_sm = cv2.resize(proc_p6, (w, h))

cv2.putText(raw_sm, "Raw Original", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
cv2.putText(proc_sm, "Current Vibrant", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)

comp = np.hstack([raw_sm, proc_sm])
cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/raw_vs_current_comparison.png", comp)
print("Saved raw_vs_current_comparison.png")
