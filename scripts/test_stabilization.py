import os
import subprocess

raw_file = "user_raw_assets/WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4"
trf_file = "transforms.trf"
out_test = "test_stabilized.mp4"

# Pass 1: detect stabilization transforms
cmd1 = [
    "ffmpeg", "-y",
    "-i", raw_file,
    "-ss", "3.0",
    "-t", "3.0",
    "-vf", "vidstabdetect=stepsize=6:shakiness=8:accuracy=15:result=" + trf_file,
    "-f", "null",
    "-"
]
subprocess.run(cmd1, check=True)

# Pass 2: apply stabilization transforms + color + upscale + fps
vf = (
    f"vidstabtransform=input={trf_file}:smoothing=20:optalgo=gauss:crop=black:zoom=2:interpol=bicubic,"
    "hqdn3d=1.5:1.5:4:4,"
    "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
    "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
    "eq=brightness=0.07:contrast=1.07:saturation=1.28,"
    "cas=0.55,"
    "fps=24"
)

cmd2 = [
    "ffmpeg", "-y",
    "-i", raw_file,
    "-ss", "3.0",
    "-t", "3.0",
    "-vf", vf,
    "-c:v", "libx264",
    "-preset", "fast",
    "-tune", "fastdecode",
    "-g", "1",
    "-crf", "14",
    out_test
]
subprocess.run(cmd2, check=True)
print("Stabilized test clip rendered successfully!")
