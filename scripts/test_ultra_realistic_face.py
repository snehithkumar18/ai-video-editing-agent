import cv2
import numpy as np

raw_img = cv2.imread("user_raw_assets/WhatsApp Image 2026-11-09 at 11.46.36 (1).jpeg")
h, w = raw_img.shape[:2]

# 9:16 target crop
target_ratio = 9.0 / 16.0
new_w = int(h * target_ratio)
x_start = (w - new_w) // 2
cropped = raw_img[:, x_start:x_start+new_w]
resized = cv2.resize(cropped, (1080, 1920), interpolation=cv2.INTER_LANCZOS4)

# Blemish removal on nose
nose_roi = resized[720:920, 460:620]
lab = cv2.cvtColor(nose_roi, cv2.COLOR_BGR2LAB)
l_ch = lab[:, :, 0]
med = cv2.medianBlur(l_ch, 21)
diff = cv2.subtract(med, l_ch)
_, mask = cv2.threshold(diff, 14, 255, cv2.THRESH_BINARY)
num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
clean_mask = np.zeros_like(mask)
for lbl in range(1, num_labels):
    if 8 < stats[lbl, cv2.CC_STAT_AREA] < 350:
        clean_mask[labels == lbl] = 255
clean_mask = cv2.dilate(clean_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
if np.sum(clean_mask) > 0:
    resized[720:920, 460:620] = cv2.inpaint(nose_roi, clean_mask, 5, cv2.INPAINT_TELEA)

# Skin tone mask in YCrCb
ycrcb = cv2.cvtColor(resized, cv2.COLOR_BGR2YCrCb)
skin_mask = cv2.inRange(ycrcb, np.array([0, 133, 77]), np.array([255, 173, 127]))
skin_mask_f = cv2.GaussianBlur(skin_mask.astype(np.float32) / 255.0, (31, 31), 15)
skin_mask_3c = np.repeat(skin_mask_f[:, :, np.newaxis], 3, axis=2)

# Filmic exposure & selective color vibrance
hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV).astype(np.float32)
h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]

v_norm = v / 255.0
v_filmic = 0.70 * v_norm + 0.30 * (3 * (v_norm ** 2) - 2 * (v_norm ** 3))
v_filmic = np.clip(v_filmic * 1.05 + 4, 0, 1.0) * 255.0
hsv[:, :, 2] = v_filmic

# Selective saturation:
# Skin gets delicate, natural +6% saturation (true human skin color)
# Jewelry, clothing, background get +26% saturation (colourful & vivid!)
sat_factor = 1.26 * (1.0 - skin_mask_f) + 1.06 * skin_mask_f
hsv[:, :, 1] = np.clip(s * sat_factor, 0, 255)

graded_bgr = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

# Very gentle skin tone smoothing (retaining 75% natural texture, zero plastic look)
smooth_skin = cv2.edgePreservingFilter(graded_bgr, flags=cv2.RECURS_FILTER, sigma_s=25, sigma_r=0.20)
skin_realistic = (graded_bgr * (1.0 - skin_mask_3c * 0.25) + smooth_skin * (skin_mask_3c * 0.25)).astype(np.uint8)

# Contrast Adaptive Sharpening
blur_high = cv2.GaussianBlur(skin_realistic, (0, 0), 1.2)
final_ultra = cv2.addWeighted(skin_realistic, 1.22, blur_high, -0.22, 0)

# Compare with current photo_06.jpg
curr_p6 = cv2.imread("public/processed_reel_assets/photo_06.jpg")
h_sm, w_sm = 960, 540
c_sm = cv2.resize(curr_p6, (w_sm, h_sm))
u_sm = cv2.resize(final_ultra, (w_sm, h_sm))

cv2.putText(c_sm, "Current Vibrant", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)
cv2.putText(u_sm, "Ultra Realistic", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)

comp = np.hstack([c_sm, u_sm])
cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/vibrant_vs_ultra_realistic_face.png", comp)
print("Saved vibrant_vs_ultra_realistic_face.png!")
