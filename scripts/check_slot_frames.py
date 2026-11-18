import json

# Check DEFAULT_REEL_SLOTS timing
slots = [
  { "slotIndex": 1,  "startSec": 0.00,  "endSec": 0.21,  "durationSec": 0.21 },
  { "slotIndex": 2,  "startSec": 0.21,  "endSec": 0.46,  "durationSec": 0.25 },
  { "slotIndex": 3,  "startSec": 0.46,  "endSec": 0.67,  "durationSec": 0.21 },
  { "slotIndex": 4,  "startSec": 0.67,  "endSec": 0.88,  "durationSec": 0.21 },
  { "slotIndex": 5,  "startSec": 0.88,  "endSec": 1.08,  "durationSec": 0.21 },
  { "slotIndex": 6,  "startSec": 1.08,  "endSec": 1.33,  "durationSec": 0.25 },
  { "slotIndex": 7,  "startSec": 1.33,  "endSec": 1.50,  "durationSec": 0.17 },
  { "slotIndex": 8,  "startSec": 1.50,  "endSec": 1.75,  "durationSec": 0.25 },
  { "slotIndex": 9,  "startSec": 1.75,  "endSec": 2.00,  "durationSec": 0.25 },
  { "slotIndex": 10, "startSec": 2.00,  "endSec": 2.21,  "durationSec": 0.21 },
  { "slotIndex": 11, "startSec": 2.21,  "endSec": 2.46,  "durationSec": 0.25 },
  { "slotIndex": 12, "startSec": 2.46,  "endSec": 2.71,  "durationSec": 0.25 },
  { "slotIndex": 13, "startSec": 2.71,  "endSec": 2.92,  "durationSec": 0.21 },
  { "slotIndex": 14, "startSec": 2.92,  "endSec": 3.12,  "durationSec": 0.21 },
  { "slotIndex": 15, "startSec": 3.12,  "endSec": 3.46,  "durationSec": 0.33 },
  { "slotIndex": 16, "startSec": 3.46,  "endSec": 4.54,  "durationSec": 1.08 },
  { "slotIndex": 17, "startSec": 4.54,  "endSec": 4.71,  "durationSec": 0.17 },
  { "slotIndex": 18, "startSec": 4.71,  "endSec": 5.88,  "durationSec": 1.17 },
  { "slotIndex": 19, "startSec": 5.88,  "endSec": 6.58,  "durationSec": 0.71 },
  { "slotIndex": 20, "startSec": 6.58,  "endSec": 7.67,  "durationSec": 1.08 },
  { "slotIndex": 21, "startSec": 7.67,  "endSec": 8.21,  "durationSec": 0.54 },
  { "slotIndex": 22, "startSec": 8.21,  "endSec": 8.75,  "durationSec": 0.54 },
  { "slotIndex": 23, "startSec": 8.75,  "endSec": 9.42,  "durationSec": 0.67 },
  { "slotIndex": 24, "startSec": 9.42,  "endSec": 10.50, "durationSec": 1.08 },
  { "slotIndex": 25, "startSec": 10.50, "endSec": 11.33, "durationSec": 0.83 },
  { "slotIndex": 26, "startSec": 11.33, "endSec": 11.88, "durationSec": 0.54 },
  { "slotIndex": 27, "startSec": 11.88, "endSec": 12.46, "durationSec": 0.58 },
  { "slotIndex": 28, "startSec": 12.46, "endSec": 14.25, "durationSec": 1.79 },
  { "slotIndex": 29, "startSec": 14.25, "endSec": 14.88, "durationSec": 0.62 },
  { "slotIndex": 30, "startSec": 14.88, "endSec": 16.38, "durationSec": 1.50 },
]

fps = 24
curr_frame = 0
for s in slots:
    from_f = round(s["startSec"] * fps)
    dur_f = max(1, round(s["durationSec"] * fps))
    end_f = from_f + dur_f
    gap = from_f - curr_frame
    print(f"Slot {s['slotIndex']:02d}: from={from_f:3d}, dur={dur_f:2d}, to={end_f:3d} | Gap from prev: {gap:+d}")
    curr_frame = end_f
