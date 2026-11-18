import subprocess
import os

# Check lines of code in git tracked files
res = subprocess.run(["git", "ls-files"], capture_output=True, text=True)
files = res.stdout.strip().split("\n")

code_exts = {".ts", ".tsx", ".js", ".jsx", ".py", ".css", ".sql", ".html"}
excluded_prefixes = (".agents/", "node_modules/", "package-lock.json", ".next/")

total_lines = 0
file_count = 0
by_ext = {}

for f in files:
    f = f.strip()
    if any(f.startswith(p) for p in excluded_prefixes):
        continue
    _, ext = os.path.splitext(f)
    if ext in code_exts:
        try:
            with open(f, "r", encoding="utf-8", errors="ignore") as fh:
                non_empty = sum(1 for line in fh if line.strip())
                total_lines += non_empty
                file_count += 1
                by_ext[ext] = by_ext.get(ext, 0) + non_empty
        except Exception:
            pass

print(f"Total non-empty code lines (own code): {total_lines}")
print(f"Total files: {file_count}")
for ext, cnt in sorted(by_ext.items(), key=lambda x: x[1], reverse=True):
    print(f"  {ext:6s}: {cnt:6d} lines")

# Also print total commits
res_c = subprocess.run(["git", "rev-list", "--count", "HEAD"], capture_output=True, text=True)
print(f"Total commits in repo: {res_c.stdout.strip()}")
