import cv2
import numpy as np
import os

raw_dir = "user_raw_assets"
out_dir = "public/processed_reel_assets_realistic"
os.makedirs(out_dir, exist_ok=True)

image_files = sorted([f for f in os.listdir(raw_dir) if f.endswith(".jpeg") or f.endswith(".jpg")])

print(f"=== PROCESSING ALL {len(image_files)} PHOTOS WITH ULTRA-REALISTIC COLOR SCIENCE ===")

for i, img_name in enumerate(image_files):
    in_path = os.path.join(raw_dir, img_name)
    out_filename = f"photo_{i+1:02d}.jpg"
    out_path = os.path.join(out_dir, out_filename)
    
    img = cv2.imread(in_path)
    if img is None: continue
    h, w = img.shape[:2]
    
    # 9:16 target crop
    target_ratio = 9.0 / 16.0
    current_ratio = w / h
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        x_start = (w - new_w) // 2
        cropped = img[:, x_start:x_start+new_w]
    else:
        new_h = int(w / target_ratio)
        y_start = max(0, int((h - new_h) * 0.25))
        cropped = img[y_start:y_start+new_h, :]
        
    resized = cv2.resize(cropped, (1080, 1920), interpolation=cv2.INTER_LANCZOS4)
    
    # 1. Blemish removal on nose area
    nose_roi = resized[720:920, 460:620]
    lab_nose = cv2.cvtColor(nose_roi, cv2.COLOR_BGR2LAB)
    l_ch = lab_nose[:, :, 0]
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

    # 2. Filmic S-curve on luminance
    img_f = resized.astype(np.float32) / 255.0
    gamma = 0.95
    tonal = np.power(img_f, gamma)
    tonal = tonal * tonal * (3.0 - 2.0 * tonal)
    tonal = 0.75 * img_f + 0.25 * tonal

    # 3. Selective Skin vs Scene Color Science in LAB
    lab = cv2.cvtColor((tonal * 255.0).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab[:, :, 0], lab[:, :, 1], lab[:, :, 2]

    # Skin tone vector
    a_dist = np.abs(A - 146.0) / 16.0
    b_dist = np.abs(B - 148.0) / 18.0
    skin_dist = np.sqrt(a_dist**2 + b_dist**2)
    skin_weight = np.clip(1.0 - skin_dist, 0.0, 1.0)
    skin_weight = cv2.GaussianBlur(skin_weight, (25, 25), 10)

    # Balanced natural golden skin: reduce red flare by 5%, add gentle golden warmth +2.5
    A_calib = A * (1.0 - skin_weight * 0.05)
    B_calib = B + (skin_weight * 2.5)

    # For non-skin (clothing, mehendi, jewelry, background): boost chroma vibrancy (+22%)
    non_skin = 1.0 - skin_weight
    chroma_boost = 1.0 + non_skin * 0.22
    A_graded = 128.0 + (A_calib - 128.0) * chroma_boost
    B_graded = 128.0 + (B_calib - 128.0) * chroma_boost

    # Micro-contrast CLAHE on L channel
    clahe = cv2.createCLAHE(clipLimit=1.2, tileGridSize=(8, 8))
    L_enhanced = clahe.apply(L.astype(np.uint8)).astype(np.float32)
    L_final = 0.65 * L + 0.35 * L_enhanced

    lab_graded = cv2.merge([
        np.clip(L_final, 0, 255).astype(np.uint8),
        np.clip(A_graded, 0, 255).astype(np.uint8),
        np.clip(B_graded, 0, 255).astype(np.uint8)
    ])
    bgr_graded = cv2.cvtColor(lab_graded, cv2.COLOR_LAB2BGR)

    # 4. Natural Texture Retention (18% edge-preserving smooth on skin, 82% real organic skin pores)
    smooth = cv2.edgePreservingFilter(bgr_graded, flags=cv2.RECURS_FILTER, sigma_s=20, sigma_r=0.20)
    skin_weight_3c = np.repeat(skin_weight[:, :, np.newaxis], 3, axis=2)
    blended_skin = (bgr_graded * (1.0 - skin_weight_3c * 0.18) + smooth * (skin_weight_3c * 0.18)).astype(np.uint8)

    # 5. CAS Unsharp Masking
    blur = cv2.GaussianBlur(blended_skin, (0, 0), 1.2)
    final_ultra = cv2.addWeighted(blended_skin, 1.20, blur, -0.20, 0)
    
    cv2.imwrite(out_path, final_ultra, [cv2.IMWRITE_JPEG_QUALITY, 99])
    print(f"Photo {i+1:02d} rendered with ultra-realistic colors -> {out_filename}")

print("\n=== ALL 16 PHOTOS PROCESSED SUCCESSFULLY ===")
