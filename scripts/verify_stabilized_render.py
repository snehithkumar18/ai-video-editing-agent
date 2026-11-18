import cv2
import numpy as np

cap = cv2.VideoCapture("public/renders/aesthetic_viral_reel.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)

# Sample midpoints of all 14 video slots:
# Slots: 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
slot_times = [
    (16, 4.0),
    (18, 5.2),
    (19, 6.2),
    (20, 7.1),
    (21, 7.9),
    (22, 8.4),
    (23, 9.0),
    (24, 9.9),
    (25, 10.9),
    (26, 11.6),
    (27, 12.1),
    (28, 13.3),
    (29, 14.5),
    (30, 15.6),
]

imgs = []
h, w = 320, 180
for slot, t in slot_times:
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(t * fps))
    ret, frame = cap.read()
    if ret:
        sm = cv2.resize(frame, (w, h))
        cv2.putText(sm, f"Slot {slot} ({t:.1f}s)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        imgs.append(sm)

cap.release()

# Arrange in 2 rows of 7
row1 = np.hstack(imgs[:7])
row2 = np.hstack(imgs[7:])
sheet = np.vstack([row1, row2])
out_p = "C:/Users/NEHITH/.gemini/antigravity/brain/f8c38a1e-14b9-4552-bfbf-95a19bb5e595/stabilized_smooth_reel_check.png"
cv2.imwrite(out_p, sheet)
print("Saved stabilized_smooth_reel_check.png")
