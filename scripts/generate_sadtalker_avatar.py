import sys
import os
import shutil
from gradio_client import Client, handle_file

def main():
    image_path = os.path.abspath("public/uploaded_character.jpg")
    audio_path = os.path.abspath("public/intro_hook.wav")
    output_path = os.path.abspath("public/talking_avatar_generated.mp4")

    print("[*] Connecting to open-source SadTalker space...")
    client = Client("kevinwang676/SadTalker")

    print(f"[*] Submitting character image ({image_path}) and audio ({audio_path})...")
    # Parameters in positional order:
    # 0: source_image
    # 1: input_audio
    # 2: preprocess ('crop', 'resize', 'full')
    # 3: still_mode_fewer_hand_motion (bool)
    # 4: gfpgan_as_face_enhancer (bool)
    # 5: batch_size_in_generation (int/float)
    # 6: face_model_resolution ('256', '512')
    # 7: pose_style (int/float 0-46)
    result = client.predict(
        handle_file(image_path),
        handle_file(audio_path),
        "crop",
        False,
        True,
        1,
        "512",
        0,
        fn_index=0
    )

    print(f"[*] Result received: {result}")
    video_file = result
    if isinstance(result, dict) and "video" in result:
        video_file = result["video"]
    elif isinstance(result, list) and len(result) > 0:
        video_file = result[0]

    shutil.copyfile(video_file, output_path)
    print(f"[+] Successfully generated talking avatar at: {output_path}")

if __name__ == "__main__":
    main()
