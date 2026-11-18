import os
import sys
import yt_dlp

url = "https://www.instagram.com/reel/DQ8xf5DD8-_/"
output_dir = "new_reel_template"
os.makedirs(output_dir, exist_ok=True)

ydl_opts = {
    "outtmpl": os.path.join(output_dir, "source_reel.%(ext)s"),
    "format": "bestvideo+bestaudio/best",
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        print("Downloaded title:", info.get("title"))
        print("Duration:", info.get("duration"))
        print("Resolution:", f"{info.get('width')}x{info.get('height')}")
except Exception as e:
    print(f"Error downloading: {e}")
    sys.exit(1)
