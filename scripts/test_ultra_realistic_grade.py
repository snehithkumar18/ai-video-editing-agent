import cv2
import numpy as np

# Load raw photo 06
raw_img = cv2.imread("user_raw_assets/WhatsApp Image 2026-11-09 at 11.46.31.jpeg")
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

# -------------------------------------------------------------
# ULTRA-REALISTIC COLOR GRADE
# -------------------------------------------------------------
# 1. Detect Skin Tone Mask (YCrCb color space is industry standard for human skin)
ycrcb = cv2.cvtColor(resized, cv2.COLOR_BGR2YCrCb)
y, cr, cb = cv2.split(ycrcb)
# Standard skin tone range: Cr in [133, 173], Cb in [77, 127]
skin_mask = cv2.inRange(ycrcb, np.array([0, 133, 77]), np.array([255, 173, 127]))
# Feather the mask softly for seamless transition
skin_mask_f = cv2.GaussianBlur(skin_mask.astype(np.float32) / 255.0, (31, 31), 15)
skin_mask_3c = np.repeat(skin_mask_f[:, :, np.newaxis], 3, axis=2)

# 2. Color Enhancement:
# Non-skin areas: Rich, vibrant colors (+24% saturation, rich jewel tones)
# Skin areas: Ultra-realistic natural golden-warm skin tone (+4% saturation, soft filmic roll-off)
hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV).astype(np.float32)
h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]

# Filmic Tone Curve (S-curve on luminance for lifelike depth and dynamic range)
# Softens harsh highlights, enriches midtones, deepens clean blacks
v_norm = v / 255.0
# Gentle filmic curve: 3*v^2 - 2*v^3 blended with linear
v_filmic = 0.65 * v_norm + 0.35 * (3 * (v_norm ** 2) - 2 * (v_norm ** 3))
# Slight exposure lift for luminous, radiant look (+4%)
v_filmic = np.clip(v_filmic * 1.05, 0, 1.0) * 255.0
hsv[:, :, 2] = v_filmic

# Selective saturation:
# For skin: natural, realistic factor 1.05
# For surroundings/fabrics/jewelry/decorations: vivid factor 1.25
sat_factor = 1.25 * (1.0 - skin_mask_f) + 1.05 * skin_mask_f
hsv[:, :, 1] = np.clip(s * sat_factor, 0, 255)

graded_bgr = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

# 3. Warm Gold Skin Hue Nudge:
# Add a very subtle filmic warmth to skin highlights while keeping shadows neutral
b, g, r = cv2.split(graded_bgr.astype(np.float32))
# Lift red slightly in mid-to-high skin tones (+2%), keep blue pristine in background
r = np.clip(r + (skin_mask_f * 4.0), 0, 255)
b = np.clip(b - (skin_mask_f * 2.0), 0, 255)
realistic_graded = cv2.merge([b, g, r]).astype(np.uint8)

# 4. Ultra-Realistic Detail Enhancement (Bilateral Micro-Contrast)
# Enhances jewelry, eyelashes, eyes, and fabrics without creating plastic skin or halo artifacts
smooth_skin = cv2.edgePreservingFilter(realistic_graded, flags=cv2.RECURS_FILTER, sigma_s=25, sigma_r=0.20)
# Blend only 20% smooth on skin to preserve 80% natural organic skin pores
skin_realistic = (realistic_graded * (1.0 - skin_mask_3c * 0.22) + smooth_skin * (skin_mask_3c * 0.22)).astype(np.uint8)

# Subtle unsharp mask for crystal clear 4K appearance
blur_high = cv2.GaussianBlur(skin_realistic, (0, 0), 1.2)
final_ultra = cv2.addWeighted(skin_realistic, 1.22, blur_high, -0.22, 0)

# Compare side by side with current vibrant photo 06
curr_p6 = cv2.imread("public/processed_reel_assets/photo_06.jpg")
h_sm, w_sm = 960, 540
c_sm = cv2.resize(curr_p6, (w_sm, h_sm))
u_sm = cv2.resize(final_ultra, (w_sm, h_sm))

cv2.putText(c_sm, "Current Vibrant", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)
cv2.putText(u_sm, "Ultra Realistic", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)

comp = np.hstack([c_sm, u_sm])
cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/vibrant_vs_ultra_realistic.png", comp)
cv2.imwrite("test_ultra_realistic_photo06.jpg", final_ultra)
print("Saved vibrant_vs_ultra_realistic.png!")
