import json

path = ".local_dev_db/projects.json"
with open(path, "r", encoding="utf-8") as f:
    db = json.load(f)

projects = db if isinstance(db, list) else db.get("projects", [])

for p in projects:
    if p.get("id") == "local-1793704545009-c8d9gi":
        p["status"] = "complete"
        p["final_video_url"] = "/renders/ai_automation_mastery_viral.mp4"
        p["thumbnail_url"] = "/thumbnails/clean_thumbnail_9x16.jpg"
        print("Updated project local-1793704545009-c8d9gi with clean thumbnail and final video")

with open(path, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2)

print("Saved updated database successfully!")
