import os
raw_dir = "user_raw_assets"
image_files = sorted([f for f in os.listdir(raw_dir) if f.endswith(".jpeg") or f.endswith(".jpg")])
for i, f in enumerate(image_files):
    print(f"photo_{i+1:02d}.jpg <= {f}")
