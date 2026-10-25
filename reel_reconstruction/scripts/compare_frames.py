import os
import cv2
import numpy as np

def create_comparison():
    out_dir = "reel_reconstruction/output/comparisons"
    os.makedirs(out_dir, exist_ok=True)

    pairs = [
        ("scene_01_ACCOUNT_GROWTH.jpg", "still_scene_01.png", "Scene 01: Account Growth (39.5K)"),
        ("scene_02_THE_SYSTEM.jpg", "still_scene_02.png", "Scene 02: The System Sealed"),
        ("scene_09_SYSTEM_221_FILES.jpg", "still_scene_09.png", "Scene 09: System 221 Files"),
        ("scene_19_CALL_TO_ACTION_SKILL.jpg", "still_scene_19.png", "Scene 19: Call to Action 'SKILL'"),
    ]

    for ref_name, rec_name, title in pairs:
        ref_path = os.path.join("reel_reconstruction/analysis/frames", ref_name)
        rec_path = os.path.join("reel_reconstruction/output", rec_name)

        if not os.path.exists(ref_path) or not os.path.exists(rec_path):
            print(f"Skipping {title}, missing file: ref={os.path.exists(ref_path)}, rec={os.path.exists(rec_path)}")
            continue

        ref_img = cv2.imread(ref_path)
        rec_img = cv2.imread(rec_path)

        # Ensure both are 720x1280
        ref_h, ref_w = ref_img.shape[:2]
        rec_img = cv2.resize(rec_img, (ref_w, ref_h))

        # Add title headers
        header_h = 80
        comp_w = ref_w * 2 + 20
        comp_h = ref_h + header_h

        canvas = np.ones((comp_h, comp_w, 3), dtype=np.uint8) * 240 # Warm off-white #F0F0F0

        # Place images
        canvas[header_h:, :ref_w] = ref_img
        canvas[header_h:, ref_w + 20:] = rec_img

        # Labels
        cv2.putText(canvas, f"REFERENCE: {title}", (40, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (20, 20, 20), 2, cv2.LINE_AA)
        cv2.putText(canvas, "RECONSTRUCTED (User Character + Remotion)", (ref_w + 50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (30, 20, 220), 2, cv2.LINE_AA)

        out_file = os.path.join(out_dir, f"compare_{rec_name}")
        cv2.imwrite(out_file, canvas)
        print(f"Wrote comparison to {out_file}")

if __name__ == "__main__":
    create_comparison()
