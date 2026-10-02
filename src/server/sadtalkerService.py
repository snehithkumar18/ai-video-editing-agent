import os
import sys
import time
import argparse
from pathlib import Path
from gradio_client import Client, handle_file

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[2] / ".env.local")
except ImportError:
    pass

HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

def generate_sadtalker_video(
    image_path: str,
    audio_path: str,
    output_path: str,
    use_enhancer: bool = False,
    size: str = "256",
    still_mode: bool = False
) -> str:
    """
    Synthesizes a realistic neural talking character video using SadTalker.
    Attempts the user's private space first (Snehith1826/SadTalker),
    then falls back to community spaces if needed.
    """
    space_candidates = [
        "Snehith1826/SadTalker",
        "John6666/SadTalker"
    ]

    last_error = None
    for space_id in space_candidates:
        try:
            print(f"[SadTalker] Attempting connection to {space_id}...", flush=True)
            client = Client(space_id, token=HF_TOKEN)
            print(f"[SadTalker] Connected to {space_id}. Submitting inference job...", flush=True)

            job = client.submit(
                source_image=handle_file(image_path),
                driven_audio=handle_file(audio_path),
                preprocess="crop",
                still_mode=still_mode,
                use_enhancer=use_enhancer,
                batch_size=1,
                size=size,
                pose_style=0,
                facerender="facevid2vid",
                exp_scale=1.0,
                use_ref_video=False,
                ref_video=None,
                ref_info="pose",
                use_idle_mode=False,
                length_of_audio=0,
                use_blink=True,
                api_name="/test"
            )

            while not job.done():
                status = job.status()
                rank_str = f" (Queue rank: {status.rank})" if getattr(status, 'rank', None) is not None else ""
                print(f"[SadTalker] Status: {status.code}{rank_str}", flush=True)
                time.sleep(3)

            result = job.result()
            print(f"[SadTalker] Generation complete! Result: {result}", flush=True)

            video_file = result.get("video") if isinstance(result, dict) else result
            if not video_file or not os.path.exists(video_file):
                raise ValueError(f"Generated video file not found at: {video_file}")

            # Copy to output path
            output_dir = Path(output_path).parent
            output_dir.mkdir(parents=True, exist_ok=True)

            import shutil
            shutil.copy2(video_file, output_path)
            print(f"[SadTalker] Successfully saved video to: {output_path}", flush=True)
            return output_path

        except Exception as e:
            print(f"[SadTalker] Failed with {space_id}: {e}", flush=True)
            last_error = e

    raise RuntimeError(f"All SadTalker spaces failed. Last error: {last_error}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SadTalker Neural Talking Character Generator")
    parser.add_argument("--image", required=True, help="Path to character portrait image")
    parser.add_argument("--audio", required=True, help="Path to speech audio file")
    parser.add_argument("--output", required=True, help="Path to output MP4 video")
    parser.add_argument("--enhance", action="store_true", help="Enable GFPGAN facial enhancer")
    parser.add_argument("--size", default="256", choices=["256", "512"], help="Output video resolution")
    parser.add_argument("--still", action="store_true", help="Lock head still (disables 3D nodding)")

    args = parser.parse_args()
    generate_sadtalker_video(
        image_path=args.image,
        audio_path=args.audio,
        output_path=args.output,
        use_enhancer=args.enhance,
        size=args.size,
        still_mode=args.still
    )
