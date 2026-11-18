import subprocess

res = subprocess.run(
    ["git", "log", "--shortstat", "--format=COMMIT:%h %s (%an <%ae>)"],
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="ignore"
)

lines = res.stdout.split("\n")
commits = []
current_commit = None

for line in lines:
    if line.startswith("COMMIT:"):
        current_commit = {"info": line[7:], "insertions": 0, "deletions": 0}
        commits.append(current_commit)
    elif "insertion" in line or "deletion" in line:
        parts = line.split(",")
        for p in parts:
            if "insertion" in p:
                try:
                    current_commit["insertions"] = int(p.strip().split()[0])
                except: pass
            elif "deletion" in p:
                try:
                    current_commit["deletions"] = int(p.strip().split()[0])
                except: pass

print(f"Total commits analyzed: {len(commits)}")
# Sort by insertions descending
commits_by_size = sorted(commits, key=lambda x: x["insertions"], reverse=True)
print("\n--- TOP 10 LARGEST COMMITS ---")
for c in commits_by_size[:10]:
    print(f"{c['insertions']:6d} lines added | {c['info']}")
