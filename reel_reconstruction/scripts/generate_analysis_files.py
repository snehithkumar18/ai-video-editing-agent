import json

def generate_visual_inventory():
    inventory = {
        "design_system": {
            "background": {
                "base_color": "#F4F1EA",
                "texture": "subtle paper grain with 32px dot grid matrix",
                "dot_color": "rgba(0, 0, 0, 0.05)"
            },
            "color_palette": {
                "off_white_paper": "#F4F1EA",
                "card_white": "#FFFFFF",
                "card_dark": "#121417",
                "card_dark_terminal": "#0B0D0F",
                "accent_coral_red": "#E11D48",
                "accent_red_bright": "#EF4444",
                "text_primary": "#0F1115",
                "text_secondary": "#525866",
                "text_muted": "#868C98",
                "border_light": "#E2E0D8",
                "border_dark": "#23262D",
                "badge_green": "#10B981"
            },
            "typography": {
                "headline_font": "Inter, Montserrat, sans-serif, font-weight 800",
                "emphasis_font": "Playfair Display, Georgia, serif, italic, font-weight 700",
                "monospace_font": "Fira Code, JetBrains Mono, monospace, font-weight 600",
                "annotation_font": "Inter, sans-serif, font-weight 600, uppercase"
            }
        },
        "character_specification": {
            "source_type": "User photo reference (young man, short dark hair, trimmed beard/mustache, dark checkered shirt)",
            "target_style": "Illustrated clean cutout matching reference vector/outline aesthetic",
            "clothing": "Dark checkered button-down shirt over crewneck or illustrated stylized counterpart",
            "anchor": "Bottom-center / bottom-right, occupying lower 35% (y: 820px - 1280px)",
            "key_poses": [
                {"pose_id": "pose_neutral_speak", "action": "Hands resting at chest/waist level, speaking"},
                {"pose_id": "pose_point_up_right", "action": "Right hand pointing index finger up-right toward cards"},
                {"pose_id": "pose_both_hands_point", "action": "Both hands pointing up toward central graphic"},
                {"pose_id": "pose_chin_think", "action": "Hand on chin / whisper gesture"},
                {"pose_id": "pose_shrug_palms", "action": "Both palms open in shrug/explaining gesture"},
                {"pose_id": "pose_direct_point", "action": "Finger pointing forward toward viewer for CTA"}
            ]
        },
        "graphic_assets": {
            "scene_01": ["phone_notifications_card", "profile_card_adlet", "follower_counter_pill", "red_badge_18"],
            "scene_02": ["calendar_now_card", "the_system_pill", "red_sealed_ribbon", "padlock_icon", "diagram_line"],
            "scene_03": ["phone_mockup_reel", "trajectory_line_graph", "target_pin_marker"],
            "scene_04": ["isometric_layers_stack", "red_prompt_bubble", "voiceover_pill", "motion_pill"],
            "scene_05": ["audience_crowd_heads", "phone_screen_tiktok"],
            "scene_06": ["theater_seating_diagram", "red_full_badge", "occupancy_dots"],
            "scene_07": ["ticket_2481", "red_dot_transition_matrix", "badge_001"],
            "scene_08": ["ai_slop_video_grid_6", "small_red_badges", "play_icons"],
            "scene_09": ["dark_system_221_files_card", "file_counter_large", "folder_stack"],
            "scene_10": ["patterns_md_window", "checklist_items_3", "phone_trio_bottom"],
            "scene_11": ["zoom_kick_software_card", "target_crosshairs", "spring_graph_dial"],
            "scene_12": ["caption_word_preview_key", "audio_waveform_strip", "timeline_playhead", "timecode_clock"],
            "scene_13": ["audio_rack_4_knobs", "knob_cut", "knob_speed", "knob_loud", "knob_peak", "elevenlabs_pill"],
            "scene_14": ["film_strip_cell", "red_score_stamp_2_9", "eye_review_reticle"],
            "scene_15": ["claude_code_terminal_window", "code_cursor_prompt", "keyboard_keys_layout"],
            "scene_16": ["workflow_pipeline_card", "step_script", "step_voice", "step_motion", "mobile_preview"],
            "scene_17": ["analytics_4_9m_card", "growth_spline_chart", "follower_card_39k"],
            "scene_18": ["brand_deals_card", "red_rubber_stamp_brand_deals", "dollar_metric_2500"],
            "scene_19": ["red_speech_bubble_skill", "comments_interface", "direct_message_card"]
        }
    }
    
    with open("reel_reconstruction/analysis/visual_inventory.json", "w", encoding="utf-8") as f:
        json.dump(inventory, f, indent=2)
    print("Saved visual_inventory.json!")

def generate_animation_timeline():
    # Complete 19-scene animation timing and keyframe schedule
    timeline = {
        "fps": 30,
        "total_frames": 1974,
        "duration_seconds": 65.8,
        "scenes": [
            {
                "scene_id": 1,
                "name": "ACCOUNT_GROWTH",
                "start_s": 0.0, "end_s": 4.8, "start_frame": 0, "end_frame": 144,
                "headline": "I grew this account to almost",
                "headline_emphasis": "40,000 followers",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 0, "action": "Paper background reveal with subtle zoom"},
                    {"frame": 8, "action": "Headline springs in from top"},
                    {"frame": 18, "action": "Dark notification card pops in at y: 320"},
                    {"frame": 35, "action": "Profile card with 39.5K springs in overlapping notification card"},
                    {"frame": 55, "action": "Red notification counter +18 expands with bounce"},
                    {"frame": 90, "action": "Character nods and hand gestures upward"}
                ]
            },
            {
                "scene_id": 2,
                "name": "THE_SYSTEM",
                "start_s": 4.8, "end_s": 8.4, "start_frame": 144, "end_frame": 252,
                "headline": "you the exact system, because in",
                "headline_emphasis": "3 months",
                "character_pose": "pose_both_hands_point",
                "key_events": [
                    {"frame": 144, "action": "Whip slide transition to calendar card"},
                    {"frame": 158, "action": "Calendar tear card NOW drops in with rotation -4deg"},
                    {"frame": 175, "action": "Red SEALED banner stamps across the system card"},
                    {"frame": 190, "action": "Padlock snaps shut with haptic shake"},
                    {"frame": 210, "action": "Tag line points to YOU"}
                ]
            },
            {
                "scene_id": 3,
                "name": "EARLY_TIKTOK_AI_REELS",
                "start_s": 8.4, "end_s": 11.8, "start_frame": 252, "end_frame": 354,
                "headline": "Right now, AI-animated reels are",
                "headline_emphasis": "early TikTok",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 252, "action": "Card flips into phone mockup"},
                    {"frame": 270, "action": "Phone mockup centers with reel preview inside"},
                    {"frame": 290, "action": "Growth trajectory spline draws left to right"},
                    {"frame": 320, "action": "Red pin icon drops onto start of curve"}
                ]
            },
            {
                "scene_id": 4,
                "name": "REAL_MOTION",
                "start_s": 11.8, "end_s": 14.5, "start_frame": 354, "end_frame": 435,
                "headline": "Real motion graphics,",
                "headline_emphasis": "Real motion",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 354, "action": "Headline Real motion expands with serif italic emphasis"},
                    {"frame": 368, "action": "Dark prompt bar make a reel slides from top"},
                    {"frame": 385, "action": "Isometric wireframe plates explode in 2.5D stack"},
                    {"frame": 410, "action": "Red labels voiceover and motion snap onto layers"}
                ]
            },
            {
                "scene_id": 5,
                "name": "VOICEOVER_CAPTIONS_CROWD",
                "start_s": 14.5, "end_s": 17.3, "start_frame": 435, "end_frame": 519,
                "headline": "and hardly anyone knows it's possible yet",
                "headline_emphasis": "hardly anyone",
                "character_pose": "pose_chin_think",
                "key_events": [
                    {"frame": 435, "action": "Illustrated crowd heads rise from bottom"},
                    {"frame": 455, "action": "Question marks pop above crowd"},
                    {"frame": 480, "action": "Character places finger on chin in secrecy gesture"}
                ]
            },
            {
                "scene_id": 6,
                "name": "MARKET_SATURATION",
                "start_s": 17.3, "end_s": 22.3, "start_frame": 519, "end_frame": 669,
                "headline": "But this market fills up fast, and when it does,",
                "headline_emphasis": "fills up fast",
                "character_pose": "pose_shrug_palms",
                "key_events": [
                    {"frame": 519, "action": "Theater seating diagram sweeps in"},
                    {"frame": 540, "action": "Seats turn from gray to black sequentially"},
                    {"frame": 570, "action": "Red FULL badge stamps top-right of theater card"},
                    {"frame": 620, "action": "Occupancy counter flashes 100%"}
                ]
            },
            {
                "scene_id": 7,
                "name": "DOT_TRANSITION",
                "start_s": 22.3, "end_s": 24.0, "start_frame": 669, "end_frame": 720,
                "headline": "First come, first served.",
                "headline_emphasis": "First come, first",
                "character_pose": "pose_both_hands_point",
                "key_events": [
                    {"frame": 669, "action": "Red ticket No. 2481 enters with rapid rotation"},
                    {"frame": 690, "action": "High-contrast dot matrix wiping screen horizontally"},
                    {"frame": 710, "action": "Screen clears to paper background"}
                ]
            },
            {
                "scene_id": 8,
                "name": "AI_SLOP_GRID",
                "start_s": 24.0, "end_s": 26.4, "start_frame": 720, "end_frame": 792,
                "headline": "And most AI reels look like",
                "headline_emphasis": "AI slop.",
                "character_pose": "pose_shrug_palms",
                "key_events": [
                    {"frame": 720, "action": "6-card video grid cascades in (2 rows x 3 cols)"},
                    {"frame": 735, "action": "Subtle desaturation and red badge tags on thumbnails"},
                    {"frame": 760, "action": "Character shakes head and shrugs"}
                ]
            },
            {
                "scene_id": 9,
                "name": "SYSTEM_221_FILES",
                "start_s": 26.4, "end_s": 31.8, "start_frame": 792, "end_frame": 954,
                "headline": "Mine don't. Because the system behind them isn't one prompt.",
                "headline_emphasis": "It's 221 files.",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 792, "action": "Grid wipes away, dark system card drops in"},
                    {"frame": 820, "action": "Number counter rolls rapidly from 0 to 221"},
                    {"frame": 860, "action": "Folder stack expands with layered depth"},
                    {"frame": 910, "action": "Red laser highlight crosses 221 files badge"}
                ]
            },
            {
                "scene_id": 10,
                "name": "HOOK_PATTERNS",
                "start_s": 31.8, "end_s": 35.1, "start_frame": 954, "end_frame": 1053,
                "headline": "Hook patterns and pacing rules decoded from my viral reels.",
                "headline_emphasis": "patterns.md",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 954, "action": "patterns.md code card enters with spring"},
                    {"frame": 975, "action": "Checkmark 1 Hook in <= 1.5s checks green"},
                    {"frame": 995, "action": "Checkmark 2 Event on every stressed word checks"},
                    {"frame": 1020, "action": "Checkmark 3 Nothing still > 1.2s checks"}
                ]
            },
            {
                "scene_id": 11,
                "name": "MOTION_PHYSICS_PANEL",
                "start_s": 35.1, "end_s": 39.2, "start_frame": 1053, "end_frame": 1176,
                "headline": "Spring physics, whip pans, and zoom kicks",
                "headline_emphasis": "tuned the way my videos use them.",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 1053, "action": "Software card Zoom kick snaps in with overshoot"},
                    {"frame": 1080, "action": "Red reticle zooms in on character face preview"},
                    {"frame": 1110, "action": "Punch dial needle sweeps right to max indicator"}
                ]
            },
            {
                "scene_id": 12,
                "name": "KINETIC_CAPTIONS_TIMELINE",
                "start_s": 39.2, "end_s": 42.9, "start_frame": 1176, "end_frame": 1287,
                "headline": "Word-timed kinetic captions where the keyword",
                "headline_emphasis": "lands a beat before it's said.",
                "character_pose": "pose_both_hands_point",
                "key_events": [
                    {"frame": 1176, "action": "DAW caption timeline slides from right"},
                    {"frame": 1195, "action": "Word key expands 1.3x inside focus brackets"},
                    {"frame": 1220, "action": "Red playhead moves across waveform at 00:41.17"}
                ]
            },
            {
                "scene_id": 13,
                "name": "AUDIO_PROCESSING_4_CONTROLS",
                "start_s": 42.9, "end_s": 46.8, "start_frame": 1287, "end_frame": 1404,
                "headline": "A multi-step audio chain on top of",
                "headline_emphasis": "ElevenLabs, mastered for Instagram.",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 1287, "action": "Audio rack with 4 knobs (CUT, SPEED, LOUD, PEAK) pops in"},
                    {"frame": 1310, "action": "Knobs rotate dynamically with sound wave bars"},
                    {"frame": 1345, "action": "Dark ElevenLabs pill docks underneath rack"}
                ]
            },
            {
                "scene_id": 14,
                "name": "REVIEW_BEFORE_RELEASE",
                "start_s": 46.8, "end_s": 51.0, "start_frame": 1404, "end_frame": 1530,
                "headline": "And before you ever see the reel, it scores its own motion",
                "headline_emphasis": "and fixes the weak moments.",
                "character_pose": "pose_chin_think",
                "key_events": [
                    {"frame": 1404, "action": "Film reel icon rolls in with film strip"},
                    {"frame": 1425, "action": "Red stamp 2.9/10 slams onto strip"},
                    {"frame": 1460, "action": "Inspection reticle scans and corrects weakness"}
                ]
            },
            {
                "scene_id": 15,
                "name": "SINGLE_LINE_INPUT_CLAUDE",
                "start_s": 51.0, "end_s": 54.5, "start_frame": 1530, "end_frame": 1635,
                "headline": "You type one line into",
                "headline_emphasis": "Claude Code, Cursor, or Codex,",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 1530, "action": "Dark IDE terminal window centers with tabs"},
                    {"frame": 1550, "action": "Cursor blinks, typing: make a reel about my app"},
                    {"frame": 1585, "action": "Keyboard layout mockup illuminates key taps"}
                ]
            },
            {
                "scene_id": 16,
                "name": "WORKFLOW_STAGES_CHECKLIST",
                "start_s": 54.5, "end_s": 57.2, "start_frame": 1635, "end_frame": 1716,
                "headline": "and it writes, voices, animates,",
                "headline_emphasis": "and renders the whole reel.",
                "character_pose": "pose_both_hands_point",
                "key_events": [
                    {"frame": 1635, "action": "Workflow pill container drops in"},
                    {"frame": 1650, "action": "script lights up with green check"},
                    {"frame": 1670, "action": "voice lights up with green check"},
                    {"frame": 1690, "action": "motion lights up with green check and progress bar completes"}
                ]
            },
            {
                "scene_id": 17,
                "name": "GROWTH_ANALYTICS_5M_VIEWS",
                "start_s": 57.2, "end_s": 61.5, "start_frame": 1716, "end_frame": 1845,
                "headline": "That's what got this account almost",
                "headline_emphasis": "5 million views in a month,",
                "character_pose": "pose_point_up_right",
                "key_events": [
                    {"frame": 1716, "action": "Dark analytics card with 4.9M views pops in"},
                    {"frame": 1740, "action": "Growth curve spline sweeps upward to top-right"},
                    {"frame": 1775, "action": "Floating heart icons flutter upwards"},
                    {"frame": 1810, "action": "Follower profile card docks at top"}
                ]
            },
            {
                "scene_id": 18,
                "name": "BRAND_DEALS_STAMP",
                "start_s": 61.5, "end_s": 62.5, "start_frame": 1845, "end_frame": 1875,
                "headline": "and over",
                "headline_emphasis": "$2,500 in brand deals.",
                "character_pose": "pose_both_hands_point",
                "key_events": [
                    {"frame": 1845, "action": "Brand deals monetary card $2,500+ pops in"},
                    {"frame": 1855, "action": "Giant red distressed BRAND DEALS rubber stamp slams down at -8deg angle"},
                    {"frame": 1865, "action": "Screen haptic shake on impact"}
                ]
            },
            {
                "scene_id": 19,
                "name": "CALL_TO_ACTION_SKILL",
                "start_s": 62.5, "end_s": 65.8, "start_frame": 1875, "end_frame": 1974,
                "headline": "Comment",
                "headline_emphasis": "SKILL, and I'll send you the exact system.",
                "character_pose": "pose_direct_point",
                "key_events": [
                    {"frame": 1875, "action": "Giant red speech bubble SKILL springs into center"},
                    {"frame": 1900, "action": "Comment pill cards slide from bottom"},
                    {"frame": 1930, "action": "Character points finger directly at viewer with firm nod"},
                    {"frame": 1960, "action": "Final composition locks into hold frame"}
                ]
            }
        ]
    }
    
    with open("reel_reconstruction/analysis/animation_timeline.json", "w", encoding="utf-8") as f:
        json.dump(timeline, f, indent=2)
    print("Saved animation_timeline.json!")

if __name__ == "__main__":
    generate_visual_inventory()
    generate_animation_timeline()
