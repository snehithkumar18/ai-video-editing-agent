"""VoiceStudio Engine Integration & Voice Cloning Service

Provides persistent voice profile management, reference audio indexing,
and voice synthesis using VoiceStudio (debpalash/VoiceStudio & OmniVoice).
"""

import os
import json
import sqlite3
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROFILES_DIR = os.path.join(BASE_DIR, "profiles")
DEFAULT_PROFILE_ID = "claude_reel_creator"

def get_voice_profile(profile_id: str = DEFAULT_PROFILE_ID) -> dict:
    """Retrieve metadata and file paths for a registered voice profile."""
    profile_folder = os.path.join(PROFILES_DIR, profile_id)
    profile_json = os.path.join(profile_folder, "profile.json")
    
    if not os.path.exists(profile_json):
        raise FileNotFoundError(f"Voice profile '{profile_id}' not found in {PROFILES_DIR}")
        
    with open(profile_json, "r", encoding="utf-8") as f:
        meta = json.load(f)
        
    meta["ref_audio_absolute"] = os.path.join(profile_folder, meta["ref_audio_path"])
    meta["full_audio_absolute"] = os.path.join(profile_folder, meta.get("full_audio_path", meta["ref_audio_path"]))
    return meta

def list_voice_profiles() -> list:
    """List all available local voice profiles."""
    profiles = []
    if not os.path.exists(PROFILES_DIR):
        return profiles
    for name in os.listdir(PROFILES_DIR):
        folder = os.path.join(PROFILES_DIR, name)
        json_file = os.path.join(folder, "profile.json")
        if os.path.isdir(folder) and os.path.exists(json_file):
            with open(json_file, "r", encoding="utf-8") as f:
                profiles.append(json.load(f))
    return profiles

def get_reference_audio(profile_id: str = DEFAULT_PROFILE_ID) -> tuple[str, str]:
    """Get the reference audio file path and reference transcript for zero-shot cloning."""
    prof = get_voice_profile(profile_id)
    return prof["ref_audio_absolute"], prof["ref_text"]

if __name__ == "__main__":
    print("Available Voice Profiles:")
    for p in list_voice_profiles():
        print(f" - {p['id']}: {p['name']} (Language: {p.get('language')})")
    
    ref_audio, ref_text = get_reference_audio()
    print(f"\nDefault Reference Audio: {ref_audio}")
    print(f"Reference Transcript: {ref_text[:80]}...")
