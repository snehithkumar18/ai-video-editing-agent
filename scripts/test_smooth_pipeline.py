import os
import subprocess

raw_file = "user_raw_assets/WhatsApp Video 2026-11-09 at 11.46.33 (1).mp4"
trf_file = "transforms_test.trf"
out_test = "test_smooth_clip.mp4"

# Accurate seeking: -ss after -i
cmd1 = [
    "ffmpeg", "-y",
    "-i", raw_file,
    "-ss", "3.0",
    "-t", "2.5",
    "-vf", f"vidstabdetect=stepsize=4:shakiness=8:accuracy=15:result={trf_file}",
    "-f", "null",
    "-"
]
subprocess.run(cmd1, check=True)

# Pass 2: vidstabtransform + crop to 9:16 + lanczos scale + color + minterpolate blend to 24fps
vf = (
    f"vidstabtransform=input={trf_file}:smoothing=25:optalgo=gauss:crop=black:zoom=3:interpol=bicubic,"
    "crop=ih*9/16:ih:(iw-ih*9/16)/2:(ih-ih)/2,"
    "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,"
    "eq=brightness=0.07:contrast=1.07:saturation=1.28,"
    "cas=0.55,"
    "minterpolate=fps=24:mi_mode=blend"
)

cmd2 = [
    "ffmpeg", "-y",
    "-i", raw_file,
    "-ss", "3.0",
    "-t", "2.5",
    "-vf", vf,
    "-c:v", "libx264",
    "-preset", "fast",
    "-tune", "fastdecode",
    "-g", "1",
    "-crf", "14",
    "-avoid_negative_ts", "make_zero",
    "-reset_timestamps", "1",
    "-an",
    out_test
]
subprocess.run(cmd2, check=True)
print("Rendered test_smooth_clip.mp4!")
