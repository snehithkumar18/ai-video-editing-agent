import os
import cv2

raw_dir = "user_raw_assets"
vids = sorted([f for f in os.listdir(raw_dir) if f.endswith(".mp4")])

os.makedirs("video_action_analysis", exist_ok=True)

for i, v in enumerate(vids):
    cap = cv2.VideoCapture(os.path.join(raw_dir, v))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = total_frames / fps
    
    vid_folder = f"video_action_analysis/vid_{i+1:02d}"
    os.makedirs(vid_folder, exist_ok=True)
    
    # Extract 1 frame every 1.0 second
    sec = 0.5
    idx = 0
    while sec < dur:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(sec * fps))
        ret, frame = cap.read()
        if ret:
            # Resize for quick inspection
            frame_thumb = cv2.resize(frame, (270, 480))
            cv2.imwrite(f"{vid_folder}/sec_{sec:04.1f}.jpg", frame_thumb)
            idx += 1
        sec += 1.2
        
    cap.release()
    print(f"Vid {i+1:02d} ({v}): {dur:.1f}s -> {idx} samples")
