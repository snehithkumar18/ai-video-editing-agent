import json
import subprocess
import glob

for f in sorted(glob.glob('user_raw_assets/*.mp4')):
    res = subprocess.run([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=r_frame_rate,avg_frame_rate,duration,codec_name',
        '-of', 'json', f
    ], capture_output=True, text=True)
    d = json.loads(res.stdout)
    st = d['streams'][0]
    print(f"{f}: r_frame_rate={st.get('r_frame_rate')}, avg_frame_rate={st.get('avg_frame_rate')}, dur={st.get('duration')}")
