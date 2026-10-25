import os
import cv2
import numpy as np

SCENE_FRAMES = [
    ("Scene 01: The Hook", 60),
    ("Scene 02: Reusable Skill", 180),
    ("Scene 03: The Workflow", 300),
    ("Scene 04: Visual Possibilities", 420),
    ("Scene 05: Visual Variety", 540),
    ("Scene 06: Story Purpose", 660),
    ("Scene 07: Assemble Video", 780),
    ("Scene 08: Streamlined Steps", 900),
    ("Scene 09: Reveal Results", 1020),
    ("Scene 10: Applications", 1140),
    ("Scene 11: Reusability", 1260),
    ("Scene 12: Call To Action", 1400),
]

def make_contact_sheet():
    video_path = "claude_skill_reel/output/claude_skill_reel.mp4"
    if not os.path.exists(video_path):
        print(f"Video not found at {video_path}")
        return

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Opened video: {total_frames} total frames")

    extracted_frames = []
    out_stills_dir = "claude_skill_reel/output/preview_stills"
    os.makedirs(out_stills_dir, exist_ok=True)

    for idx, (label, target_frame) in enumerate(SCENE_FRAMES):
        f = min(target_frame, total_frames - 1)
        cap.set(cv2.CAP_PROP_POS_FRAMES, f)
        ret, frame_img = cap.read()
        if not ret:
            print(f"Failed to read frame {f}")
            continue

        still_path = os.path.join(out_stills_dir, f"scene_{idx+1:02d}.jpg")
        cv2.imwrite(still_path, frame_img)
        extracted_frames.append((label, frame_img))

    cap.release()

    # Build 3 rows x 4 cols contact sheet
    # Resize each frame thumbnail: 270 x 480 (maintaining 9:16 aspect ratio)
    thumb_w = 270
    thumb_h = 480
    header_h = 100
    label_h = 35

    cols = 4
    rows = 3
    pad = 16

    grid_w = cols * thumb_w + (cols + 1) * pad
    grid_h = header_h + rows * (thumb_h + label_h) + (rows + 1) * pad

    canvas = np.ones((grid_h, grid_w, 3), dtype=np.uint8) * 244 # #F4F1EA warm cream

    # Header title
    cv2.putText(
        canvas,
        "CLAUDE SKILL ANIMATED REEL - 12 SCENE CONTACT SHEET",
        (pad + 20, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.1,
        (13, 15, 18),
        3,
        cv2.LINE_AA
    )
    cv2.putText(
        canvas,
        "Target Duration: 49.53s (1,486 frames @ 30 FPS) | 1080 x 1920 Vertical HD",
        (pad + 20, 85),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (56, 87, 249),
        2,
        cv2.LINE_AA
    )

    for i, (label, img) in enumerate(extracted_frames):
        r = i // cols
        c = i % cols

        x = pad + c * (thumb_w + pad)
        y = header_h + pad + r * (thumb_h + label_h + pad)

        thumb = cv2.resize(img, (thumb_w, thumb_h))
        canvas[y:y+thumb_h, x:x+thumb_w] = thumb

        # Draw frame border
        cv2.rectangle(canvas, (x, y), (x + thumb_w, y + thumb_h), (216, 225, 229), 2)

        # Label background pill
        cv2.rectangle(canvas, (x, y + thumb_h + 4), (x + thumb_w, y + thumb_h + label_h), (255, 255, 255), -1)
        cv2.putText(
            canvas,
            label,
            (x + 10, y + thumb_h + 24),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (20, 20, 20),
            1,
            cv2.LINE_AA
        )

    out_sheet = "claude_skill_reel/output/contact_sheet.jpg"
    cv2.imwrite(out_sheet, canvas)
    print(f"Contact sheet saved to {out_sheet}")

    # Copy to artifacts directory
    artifact_dir = "C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595"
    if os.path.exists(artifact_dir):
        artifact_sheet = os.path.join(artifact_dir, "claude_skill_reel_contact_sheet.jpg")
        cv2.imwrite(artifact_sheet, canvas)
        print(f"Copied contact sheet to {artifact_sheet}")

if __name__ == "__main__":
    make_contact_sheet()
