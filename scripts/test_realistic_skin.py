import cv2
import numpy as np

# Load raw photo 06
raw_img = cv2.imread("user_raw_assets/WhatsApp Image 2026-11-09 at 11.46.36 (1).jpeg")
h, w = raw_img.shape[:2]

# 9:16 target crop
target_ratio = 9.0 / 16.0
new_w = int(h * target_ratio)
x_start = (w - new_w) // 2
cropped = raw_img[:, x_start:x_start+new_w]
resized = cv2.resize(cropped, (1080, 1920), interpolation=cv2.INTER_LANCZOS4)

# 1. Blemish removal on nose
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
# ULTRA-REALISTIC COLOR SCIENCE GRADE
# -------------------------------------------------------------
# Work in float32 [0, 1]
img_f = resized.astype(np.float32) / 255.0

# A. Filmic Tone Curve (Cinematic S-curve: deepens blacks, lifts midtones, protects highlights)
# Soft knee highlight compression (prevents plastic/blown skin highlights)
gamma = 0.95  # gentle midtone exposure lift
tonal = np.power(img_f, gamma)
# S-curve: smooth contrast lift
tonal = tonal * tonal * (3.0 - 2.0 * tonal)
tonal = 0.75 * img_f + 0.25 * tonal  # subtle 25% filmic contrast blend

# B. Selective Skin vs Scene Color Science in LAB color space
lab = cv2.cvtColor((tonal * 255.0).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
L, A, B = lab[:, :, 0], lab[:, :, 1], lab[:, :, 2]

# In LAB, skin tones have: A (green-red) in [132, 160], B (blue-yellow) in [130, 165]
# Calculate skin probability mask
a_dist = np.abs(A - 146.0) / 16.0
b_dist = np.abs(B - 148.0) / 18.0
skin_dist = np.sqrt(a_dist**2 + b_dist**2)
skin_weight = np.clip(1.0 - skin_dist, 0.0, 1.0)
skin_weight = cv2.GaussianBlur(skin_weight, (25, 25), 10)

# Ultra-realistic skin calibration:
# In Current Vibrant, skin was too red (A channel too high).
# For ultra-realistic warm golden skin, we balance A (reduce red flare by 3%) and gently warm B (+2% golden warmth)
A_calib = A * (1.0 - skin_weight * 0.05)
B_calib = B + (skin_weight * 2.5)

# For non-skin elements (clothing, mehendi, jewelry, background):
# Boost chroma vibrancy (+22%)
non_skin = 1.0 - skin_weight
chroma_boost = 1.0 + non_skin * 0.22
A_graded = 128.0 + (A_calib - 128.0) * chroma_boost
B_graded = 128.0 + (B_calib - 128.0) * chroma_boost

# Micro-contrast on L channel with CLAHE
clahe = cv2.createCLAHE(clipLimit=1.2, tileGridSize=(8, 8))
L_enhanced = clahe.apply(L.astype(np.uint8)).astype(np.float32)
L_final = 0.65 * L + 0.35 * L_enhanced

lab_graded = cv2.merge([
    np.clip(L_final, 0, 255).astype(np.uint8),
    np.clip(A_graded, 0, 255).astype(np.uint8),
    np.clip(B_graded, 0, 255).astype(np.uint8)
])
bgr_graded = cv2.cvtColor(lab_graded, cv2.COLOR_LAB2BGR)

# C. Natural Texture Retention (15% edge-preserving filter, 85% real skin pores)
smooth = cv2.edgePreservingFilter(bgr_graded, flags=cv2.RECURS_FILTER, sigma_s=20, sigma_r=0.20)
skin_weight_3c = np.repeat(skin_weight[:, :, np.newaxis], 3, axis=2)
blended_skin = (bgr_graded * (1.0 - skin_weight_3c * 0.18) + smooth * (skin_weight_3c * 0.18)).astype(np.uint8)

# D. High-definition sharpness (CAS unsharp mask)
blur = cv2.GaussianBlur(blended_skin, (0, 0), 1.2)
final_ultra = cv2.addWeighted(blended_skin, 1.20, blur, -0.20, 0)

# Compare side-by-side with current vibrant
curr_p6 = cv2.imread("public/processed_reel_assets/photo_06.jpg")
h_sm, w_sm = 960, 540
c_sm = cv2.resize(curr_p6, (w_sm, h_sm))
u_sm = cv2.resize(final_ultra, (w_sm, h_sm))

cv2.putText(c_sm, "Current Vibrant", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)
cv2.putText(u_sm, "Ultra Realistic", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)

comp = np.hstack([c_sm, u_sm])
cv2.imwrite("C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/realistic_skin_comparison.png", comp)
print("Saved realistic_skin_comparison.png!")
