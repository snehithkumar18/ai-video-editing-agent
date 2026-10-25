import asyncio
import os
import json
import edge_tts
from pydub import AudioSegment
from faster_whisper import WhisperModel

SCENES = [
    {
        "id": 1,
        "start_s": 0.0,
        "end_s": 4.0,
        "text": "Did you know one Claude skill could help you create animated Reels at scale?"
    },
    {
        "id": 2,
        "start_s": 4.0,
        "end_s": 8.0,
        "text": "Instead of building every video from scratch, start with a reusable skill."
    },
    {
        "id": 3,
        "start_s": 8.0,
        "end_s": 12.0,
        "text": "Give it your idea, and let the workflow organize the scenes, visuals, and animations."
    },
    {
        "id": 4,
        "start_s": 12.0,
        "end_s": 16.0,
        "text": "From colorful illustrations to moving characters, each scene can tell a different part of the story."
    },
    {
        "id": 5,
        "start_s": 16.0,
        "end_s": 20.0,
        "text": "Combine different scenes, compositions, and visual styles to keep every moment interesting."
    },
    {
        "id": 6,
        "start_s": 20.0,
        "end_s": 24.0,
        "text": "The goal isn't just movement. Every visual should support the message you're telling."
    },
    {
        "id": 7,
        "start_s": 24.0,
        "end_s": 28.0,
        "text": "Then bring the pieces together into a complete vertical video."
    },
    {
        "id": 8,
        "start_s": 28.0,
        "end_s": 32.0,
        "text": "With a reusable workflow, repetitive production steps can become much easier to manage."
    },
    {
        "id": 9,
        "start_s": 32.0,
        "end_s": 36.0,
        "text": "One workflow can support many different video concepts."
    },
    {
        "id": 10,
        "start_s": 36.0,
        "end_s": 40.0,
        "text": "Think educational explainers, creative stories, product demos, and animated tutorials."
    },
    {
        "id": 11,
        "start_s": 40.0,
        "end_s": 44.0,
        "text": "Change the topic, update the assets, and adapt the scenes to your next idea."
    },
    {
        "id": 12,
        "start_s": 44.0,
        "end_s": 49.53,
        "text": "Want to build your own animated Reel workflow? Start with one skill, refine the process, and create your next video."
    }
]

async def generate_speech():
    temp_dir = "claude_skill_reel/assets/audio/temp_segments"
    os.makedirs(temp_dir, exist_ok=True)
    voice = "en-US-ChristopherNeural"

    segment_files = []

    for sc in SCENES:
        out_mp3 = os.path.join(temp_dir, f"scene_{sc['id']:02d}.mp3")
        # Target speed tuned so speech naturally fits within ~3.2 - 3.6s
        communicate = edge_tts.Communicate(sc["text"], voice, rate="+8%")
        await communicate.save(out_mp3)
        segment_files.append((sc, out_mp3))
        print(f"Generated scene {sc['id']}: {sc['text']}")

    # Assemble master track with exact target duration: 49.533 seconds = 49533 ms
    TARGET_TOTAL_MS = int(49.533 * 1000)
    master_audio = AudioSegment.silent(duration=TARGET_TOTAL_MS, frame_rate=44100)

    for sc, mp3_file in segment_files:
        seg_audio = AudioSegment.from_file(mp3_file).set_frame_rate(44100).set_channels(2)
        start_ms = int(sc["start_s"] * 1000)
        dur_ms = len(seg_audio)
        slot_len_ms = int((sc["end_s"] - sc["start_s"]) * 1000)

        # If audio is slightly longer than slot, speed it up slightly; otherwise let it sit naturally with brief pause
        if dur_ms > slot_len_ms - 100:
            speed_ratio = dur_ms / (slot_len_ms - 150)
            seg_audio = seg_audio.speedup(playback_speed=speed_ratio)
            dur_ms = len(seg_audio)

        print(f"Placing scene {sc['id']} at {start_ms}ms (dur: {dur_ms}ms, slot: {slot_len_ms}ms)")
        master_audio = master_audio.overlay(seg_audio, position=start_ms)

    master_wav = "claude_skill_reel/assets/audio/voiceover_49s.wav"
    master_audio.export(master_wav, format="wav")
    print(f"Master voiceover exported to {master_wav} (Length: {len(master_audio)}ms)")

    # Run Whisper to generate precise word-level timestamps
    print("Running Whisper for word-level timestamps...")
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe(master_wav, word_timestamps=True)

    words_list = []
    segments_list = []

    for seg in segments:
        segments_list.append({
            "id": seg.id,
            "start": round(seg.start, 2),
            "end": round(seg.end, 2),
            "text": seg.text.strip()
        })
        if seg.words:
            for w in seg.words:
                words_list.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 2),
                    "end": round(w.end, 2),
                    "probability": round(w.probability, 2)
                })

    timestamps_data = {
        "duration": round(len(master_audio) / 1000.0, 2),
        "target_duration": 49.53,
        "scenes": SCENES,
        "segments": segments_list,
        "words": words_list
    }

    timestamps_json = "claude_skill_reel/assets/audio/voiceover_timestamps.json"
    with open(timestamps_json, "w", encoding="utf-8") as f:
        json.dump(timestamps_data, f, indent=2)
    print(f"Timestamps saved to {timestamps_json} ({len(words_list)} words)")

if __name__ == "__main__":
    asyncio.run(generate_speech())
