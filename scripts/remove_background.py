#!/usr/bin/env python3
"""
Automated AI Background Removal & Green-Screen Keyer for Video Reels
Supports:
1. Video files (.mp4, .mov, .mkv) -> Transparent WebM (VP9 + alpha)
2. Image files (.jpg, .png, .webp) -> Transparent PNG
3. Fast Green-screen chroma-keying via FFmpeg
4. Deep learning AI segmentation via rembg
"""

import sys
import os
import argparse
import subprocess
from pathlib import Path
from PIL import Image

def process_image(input_path: str, output_path: str):
    from rembg import remove
    print(f"[*] Removing background from image: {input_path}")
    inp = Image.open(input_path)
    out = remove(inp)
    out.save(output_path)
    print(f"[+] Saved transparent image cutout to: {output_path}")

def process_video_chromakey(input_path: str, output_path: str, key_color="0x00FF00", similarity="0.3", blend="0.1"):
    print(f"[*] Fast Chroma-keying green screen with FFmpeg: {input_path}")
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-vf", f"colorkey={key_color}:{similarity}:{blend},format=yuva420p",
        "-c:v", "libvpx-vp9",
        "-pix_fmt", "yuva420p",
        "-auto-alt-ref", "0",
        output_path
    ]
    subprocess.run(cmd, check=True)
    print(f"[+] Saved transparent WebM to: {output_path}")

def process_video_rembg(input_path: str, output_path: str):
    print(f"[*] Removing video background using AI rembg: {input_path}")
    # Run rembg video command
    cmd = ["rembg", "p", input_path, output_path]
    subprocess.run(cmd, check=True)
    print(f"[+] Saved transparent video cutout to: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Create transparent presenter cutout for split-screen reels.")
    parser.add_argument("input", help="Input image or video path")
    parser.add_argument("-o", "--output", help="Output path (default: <name>_cutout.webm or .png)")
    parser.add_argument("--green-screen", action="store_true", help="Use fast FFmpeg chroma-keying for green-screen footage")
    parser.add_argument("--key-color", default="0x00FF00", help="Chroma key hex color (default: 0x00FF00)")
    args = parser.parse_args()

    input_p = Path(args.input)
    if not input_p.exists():
        print(f"[!] Error: Input file does not exist: {args.input}")
        sys.exit(1)

    is_video = input_p.suffix.lower() in [".mp4", ".mov", ".mkv", ".avi", ".webm"]

    if not args.output:
        if is_video:
            output_p = input_p.with_name(f"{input_p.stem}_cutout.webm")
        else:
            output_p = input_p.with_name(f"{input_p.stem}_cutout.png")
    else:
        output_p = Path(args.output)

    if not is_video:
        process_image(str(input_p), str(output_p))
    else:
        if args.green_screen:
            process_video_chromakey(str(input_p), str(output_p), key_color=args.key_color)
        else:
            process_video_rembg(str(input_p), str(output_p))

if __name__ == "__main__":
    main()
