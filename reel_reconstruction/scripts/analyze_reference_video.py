import cv2
import json
import numpy as np
import os

def analyze():
    video_path = "reel_reconstruction/reference/reference_reel.mp4"
    cap = cv2.VideoCapture(video_path)
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / fps
    
    print(f"Video opened: {width}x{height} @ {fps}fps, {total_frames} frames, {duration:.2f}s")
    
    # 19 Scene timestamps defined from narrative & audio events
    scenes = [
        {"id": 1, "name": "ACCOUNT_GROWTH", "start_s": 0.0, "end_s": 4.8, "key_s": 2.2},
        {"id": 2, "name": "THE_SYSTEM", "start_s": 4.8, "end_s": 8.4, "key_s": 6.5},
        {"id": 3, "name": "EARLY_TIKTOK_AI_REELS", "start_s": 8.4, "end_s": 11.8, "key_s": 10.2},
        {"id": 4, "name": "REAL_MOTION", "start_s": 11.8, "end_s": 14.5, "key_s": 13.2},
        {"id": 5, "name": "VOICEOVER_CAPTIONS_CROWD", "start_s": 14.5, "end_s": 17.3, "key_s": 15.8},
        {"id": 6, "name": "MARKET_SATURATION", "start_s": 17.3, "end_s": 22.3, "key_s": 19.5},
        {"id": 7, "name": "DOT_TRANSITION", "start_s": 22.3, "end_s": 24.0, "key_s": 23.2},
        {"id": 8, "name": "AI_SLOP_GRID", "start_s": 24.0, "end_s": 26.4, "key_s": 25.2},
        {"id": 9, "name": "SYSTEM_221_FILES", "start_s": 26.4, "end_s": 31.8, "key_s": 29.8},
        {"id": 10, "name": "HOOK_PATTERNS", "start_s": 31.8, "end_s": 35.1, "key_s": 33.5},
        {"id": 11, "name": "MOTION_PHYSICS_PANEL", "start_s": 35.1, "end_s": 39.2, "key_s": 37.2},
        {"id": 12, "name": "KINETIC_CAPTIONS_TIMELINE", "start_s": 39.2, "end_s": 42.9, "key_s": 41.2},
        {"id": 13, "name": "AUDIO_PROCESSING_4_CONTROLS", "start_s": 42.9, "end_s": 46.8, "key_s": 44.8},
        {"id": 14, "name": "REVIEW_BEFORE_RELEASE", "start_s": 46.8, "end_s": 51.0, "key_s": 49.0},
        {"id": 15, "name": "SINGLE_LINE_INPUT_CLAUDE", "start_s": 51.0, "end_s": 54.5, "key_s": 52.8},
        {"id": 16, "name": "WORKFLOW_STAGES_CHECKLIST", "start_s": 54.5, "end_s": 57.2, "key_s": 56.0},
        {"id": 17, "name": "GROWTH_ANALYTICS_5M_VIEWS", "start_s": 57.2, "end_s": 61.5, "key_s": 59.5},
        {"id": 18, "name": "BRAND_DEALS_STAMP", "start_s": 61.5, "end_s": 62.5, "key_s": 62.0},
        {"id": 19, "name": "CALL_TO_ACTION_SKILL", "start_s": 62.5, "end_s": 65.8, "key_s": 63.8}
    ]
    
    os.makedirs("reel_reconstruction/analysis/frames", exist_ok=True)
    
    key_images = []
    
    for sc in scenes:
        start_frame = int(sc["start_s"] * fps)
        end_frame = min(total_frames - 1, int(sc["end_s"] * fps))
        key_frame = min(total_frames - 1, int(sc["key_s"] * fps))
        
        sc["start_frame"] = start_frame
        sc["end_frame"] = end_frame
        sc["key_frame"] = key_frame
        sc["duration_frames"] = end_frame - start_frame
        
        cap.set(cv2.CAP_PROP_POS_FRAMES, key_frame)
        ret, frame = cap.read()
        if ret:
            frame_path = f"reel_reconstruction/analysis/frames/scene_{sc['id']:02d}_{sc['name']}.jpg"
            cv2.imwrite(frame_path, frame)
            sc["key_frame_path"] = frame_path
            
            # Thumbnail for contact sheet (scale down to 240x426)
            thumb = cv2.resize(frame, (240, 426))
            # Put label
            cv2.putText(thumb, f"SC {sc['id']:02d} ({sc['start_s']:.1f}s)", (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 3)
            cv2.putText(thumb, f"SC {sc['id']:02d} ({sc['start_s']:.1f}s)", (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 1)
            key_images.append(thumb)
            
    cap.release()
    
    # Save scene_breakdown.json
    with open("reel_reconstruction/analysis/scene_breakdown.json", "w", encoding="utf-8") as f:
        json.dump({"total_scenes": len(scenes), "fps": fps, "total_frames": total_frames, "scenes": scenes}, f, indent=2)
    print("Saved scene_breakdown.json!")
    
    # Build contact sheet: 4 rows x 5 cols = 20 slots (19 scenes + 1 title/info card)
    rows = 4
    cols = 5
    cell_w, cell_h = 240, 426
    sheet = np.zeros((rows * cell_h, cols * cell_w, 3), dtype=np.uint8)
    sheet[:] = (245, 245, 245) # Warm off-white
    
    for idx, thumb in enumerate(key_images):
        r = idx // cols
        c = idx % cols
        y1, y2 = r * cell_h, (r + 1) * cell_h
        x1, x2 = c * cell_w, (c + 1) * cell_w
        sheet[y1:y2, x1:x2] = thumb
        
    # Title in last slot (slot 19)
    last_r, last_c = 19 // cols, 19 % cols
    cv2.putText(sheet, "REEL CONTACT SHEET", (last_c * cell_w + 15, last_r * cell_h + 180),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (20, 20, 20), 2)
    cv2.putText(sheet, f"65.8s | 30 FPS", (last_c * cell_w + 15, last_r * cell_h + 220),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180, 20, 20), 2)
    cv2.putText(sheet, "19 Scenes", (last_c * cell_w + 15, last_r * cell_h + 260),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (100, 100, 100), 1)
                
    cv2.imwrite("reel_reconstruction/analysis/reference_contact_sheet.jpg", sheet)
    print("Saved reference_contact_sheet.jpg!")

if __name__ == "__main__":
    analyze()
