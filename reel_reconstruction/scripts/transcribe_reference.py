import json
from faster_whisper import WhisperModel

def main():
    print("Loading faster-whisper model on CPU...")
    model = WhisperModel("base", device="cpu", compute_type="int8")

    print("Transcribing reference audio with word timestamps...")
    segments, info = model.transcribe("reel_reconstruction/assets/audio/reference_audio.wav", word_timestamps=True)

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

    audio_data = {
        "language": info.language,
        "language_probability": round(info.language_probability, 2),
        "duration": round(info.duration, 2),
        "segments": segments_list,
        "words": words_list
    }

    with open("reel_reconstruction/analysis/audio_events.json", "w", encoding="utf-8") as f:
        json.dump(audio_data, f, indent=2)

    print(f"Saved audio_events.json with {len(words_list)} words across {len(segments_list)} segments!")
    for s in segments_list[:8]:
        print(f"[{s['start']}s - {s['end']}s]: {s['text']}")

if __name__ == "__main__":
    main()
