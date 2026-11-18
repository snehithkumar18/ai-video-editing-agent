import os
import subprocess

os.makedirs("new_reel_template/frames", exist_ok=True)

# Extract frames every 0.8s
subprocess.run([
    "ffmpeg", "-y", "-i", "new_reel_template/source_reel.mp4",
    "-vf", "fps=1.25,scale=360:640",
    "new_reel_template/frames/frame_%03d.jpg"
], capture_output=True)

# Also generate a contact sheet (tile grid)
subprocess.run([
    "ffmpeg", "-y", "-i", "new_reel_template/source_reel.mp4",
    "-vf", "fps=1,scale=270:480,tile=4x4",
    "-frames:v", "1",
    "new_reel_template/contact_sheet.jpg"
], capture_output=True)

print("Frames extracted. Number of frames:", len(os.listdir("new_reel_template/frames")))
